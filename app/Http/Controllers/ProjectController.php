<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Project;
use App\Models\ProjectTask;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with(['branch', 'customer', 'tasks']);

        if ($request->search) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('code', 'like', "%{$request->search}%"));
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return Inertia::render('projects/index', [
            'projects' => $query->latest()->paginate(20),
            'customers' => fn () => Customer::all(['id', 'name']),
            'branches' => fn () => Branch::all(['id', 'name']),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'branch_id' => 'required|exists:branches,id',
            'customer_id' => 'nullable|exists:customers,id',
            'description' => 'nullable|string',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        Project::create($validated);

        return redirect()->route('projects.index')->with('success', 'Project created.');
    }

    public function show(Project $project)
    {
        $project->load(['branch', 'customer', 'tasks.employee', 'tasks' => fn ($q) => $q->latest('due_date')]);

        $employees = Employee::active()->get(['id', 'name']);

        return Inertia::render('projects/show', ['project' => $project, 'employees' => $employees]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'branch_id' => 'required|exists:branches,id',
            'customer_id' => 'nullable|exists:customers,id',
            'description' => 'nullable|string',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|in:planning,in_progress,on_hold,completed,cancelled',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $project->update($validated);

        return redirect()->route('projects.index')->with('success', 'Project updated.');
    }

    public function destroy(Project $project)
    {
        $project->tasks()->delete();
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted.');
    }

    public function storeTask(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'employee_id' => 'nullable|exists:employees,id',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $validated['project_id'] = $project->id;

        ProjectTask::create($validated);

        return back()->with('success', 'Task added.');
    }

    public function updateTask(Request $request, ProjectTask $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'employee_id' => 'nullable|exists:employees,id',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'status' => 'sometimes|in:todo,in_progress,review,done',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $task->update($validated);

        if ($task->project) {
            $totalTasks = $task->project->tasks()->count();
            $doneTasks = $task->project->tasks()->where('status', 'done')->count();
            $task->project->update(['progress' => $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100) : 0]);
        }

        return back()->with('success', 'Task updated.');
    }

    public function destroyTask(ProjectTask $task)
    {
        $project = $task->project;
        $task->delete();

        if ($project) {
            $totalTasks = $project->tasks()->count();
            $doneTasks = $project->tasks()->where('status', 'done')->count();
            $project->update(['progress' => $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100) : 0]);
        }

        return back()->with('success', 'Task deleted.');
    }
}
