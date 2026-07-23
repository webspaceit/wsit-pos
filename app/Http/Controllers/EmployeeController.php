<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Salary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('branch');

        if ($request->search) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")
                ->orWhere('position', 'like', "%{$request->search}%"));
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return Inertia::render('hrm/employees/index', [
            'employees' => $query->latest()->paginate(20),
            'branches' => fn () => Branch::all(['id', 'name']),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'phone' => 'nullable|string|max:30',
            'position' => 'required|string|max:100',
            'branch_id' => 'nullable|exists:branches,id',
            'salary' => 'required|numeric|min:0',
            'join_date' => 'nullable|date',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        Employee::create($validated);

        return redirect()->route('hrm.employees.index')->with('success', 'Employee created.');
    }

    public function show(Employee $employee)
    {
        $employee->load(['branch', 'attendances' => fn ($q) => $q->latest('date')->limit(30), 'salaries' => fn ($q) => $q->latest('month')->limit(12)]);

        return Inertia::render('hrm/employees/show', ['employee' => $employee]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:employees,email,{$employee->id}",
            'phone' => 'nullable|string|max:30',
            'position' => 'required|string|max:100',
            'branch_id' => 'nullable|exists:branches,id',
            'salary' => 'required|numeric|min:0',
            'join_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,terminated',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $employee->update($validated);

        return redirect()->route('hrm.employees.index')->with('success', 'Employee updated.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('hrm.employees.index')->with('success', 'Employee deleted.');
    }

    public function attendance(Request $request)
    {
        $query = Attendance::with('employee');

        if ($request->date) {
            $query->whereDate('date', $request->date);
        } elseif ($request->month) {
            $query->whereMonth('date', substr($request->month, 5, 2))
                ->whereYear('date', substr($request->month, 0, 4));
        } else {
            $query->whereDate('date', now()->toDateString());
        }

        if ($request->employee_id) {
            $query->where('employee_id', $request->employee_id);
        }

        return Inertia::render('hrm/attendance/index', [
            'attendances' => $query->latest('date')->paginate(50),
            'employees' => fn () => Employee::active()->get(['id', 'name']),
            'filters' => $request->only(['date', 'month', 'employee_id']),
        ]);
    }

    public function attendanceStore(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'clock_in' => 'nullable|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i',
            'status' => 'required|in:present,absent,late,half_day,holiday',
            'hours_worked' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        Attendance::updateOrCreate(
            ['employee_id' => $validated['employee_id'], 'date' => $validated['date']],
            $validated
        );

        return redirect()->route('hrm.attendance.index')->with('success', 'Attendance recorded.');
    }

    public function salary(Request $request)
    {
        $query = Salary::with('employee');

        if ($request->month) {
            $query->where('month', $request->month);
        } else {
            $query->where('month', now()->format('Y-m'));
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return Inertia::render('hrm/salary/index', [
            'salaries' => $query->latest('month')->paginate(50),
            'employees' => fn () => Employee::active()->get(['id', 'name', 'salary']),
            'filters' => $request->only(['month', 'status']),
        ]);
    }

    public function salaryGenerate(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        $month = $request->month;
        $employees = Employee::active()->whereNull('end_date')->get();

        $generated = 0;
        foreach ($employees as $employee) {
            $exists = Salary::where('employee_id', $employee->id)->where('month', $month)->exists();
            if ($exists) {
                continue;
            }

            $attendance = Attendance::where('employee_id', $employee->id)
                ->whereMonth('date', substr($month, 5, 2))
                ->whereYear('date', substr($month, 0, 4))
                ->get();

            $workingDays = $attendance->whereIn('status', ['present', 'late'])->count();
            $dailyRate = $employee->salary / 30;
            $baseSalary = $dailyRate * $workingDays;

            Salary::create([
                'employee_id' => $employee->id,
                'month' => $month,
                'base_salary' => round($baseSalary, 2),
                'net_salary' => round($baseSalary, 2),
            ]);

            $generated++;
        }

        return redirect()->route('hrm.salary.index')->with('success', "Generated {$generated} salary records for {$month}.");
    }

    public function salaryPay(Request $request, Salary $salary)
    {
        $request->validate([
            'paid_amount' => 'required|numeric|min:0',
            'paid_date' => 'required|date',
        ]);

        $salary->update([
            'paid_amount' => $request->paid_amount,
            'paid_date' => $request->paid_date,
            'status' => $request->paid_amount >= $salary->net_salary ? 'paid' : 'partial',
        ]);

        return back()->with('success', 'Salary payment recorded.');
    }
}
