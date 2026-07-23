import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
    { title: 'Detail', href: '#' },
];

const taskStatusColors: Record<string, string> = { todo: 'bg-gray-100 text-gray-700', in_progress: 'bg-blue-100 text-blue-700', review: 'bg-purple-100 text-purple-700', done: 'bg-emerald-100 text-emerald-700' };
const priorityColors: Record<string, string> = { low: 'bg-gray-100 text-gray-700', medium: 'bg-blue-100 text-blue-700', high: 'bg-orange-100 text-orange-700', urgent: 'bg-red-100 text-red-700' };

export default function ProjectShow({ project, employees }: { project: any; employees: any[] }) {
    const [showAddTask, setShowAddTask] = useState(false);
    const { data, setData, post: postTask, processing, reset } = useForm({
        title: '', employee_id: '', description: '', start_date: '', due_date: '', priority: 'medium',
    });

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        postTask(`/projects/${project.id}/tasks`, { onSuccess: () => { reset(); setShowAddTask(false); } });
    };

    const updateTaskStatus = (taskId: number, status: string) => {
        router.put(`/projects/tasks/${taskId}`, { status });
    };

    const totalBudget = Number(project.budget);
    const tasksDone = project.tasks?.filter((t: any) => t.status === 'done').length || 0;
    const tasksTotal = project.tasks?.length || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        <p className="text-sm text-gray-500">{project.code} - {project.customer?.name || 'Internal'}</p>
                    </div>
                    <Link href="/projects" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">Back</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="rounded-lg border bg-white p-4 text-center"><p className="text-2xl font-bold">{project.progress}%</p><p className="text-sm text-gray-500">Complete</p></div>
                    <div className="rounded-lg border bg-white p-4 text-center"><p className="text-2xl font-bold">৳{totalBudget.toLocaleString()}</p><p className="text-sm text-gray-500">Budget</p></div>
                    <div className="rounded-lg border bg-white p-4 text-center"><p className="text-2xl font-bold">{tasksDone}/{tasksTotal}</p><p className="text-sm text-gray-500">Tasks Done</p></div>
                    <div className="rounded-lg border bg-white p-4 text-center"><p className="text-sm font-medium">{project.start_date || '-'} to {project.end_date || '-'}</p><p className="text-sm text-gray-500">Timeline</p></div>
                </div>
                <div className="rounded-lg border bg-white">
                    <div className="flex items-center justify-between px-4 py-3">
                        <h2 className="font-semibold">Tasks</h2>
                        <button onClick={() => setShowAddTask(true)} className="rounded bg-green-600 px-3 py-1 text-xs text-white">+ Add Task</button>
                    </div>
                    {showAddTask && (
                        <div className="border-t bg-gray-50 p-4">
                            <form onSubmit={addTask} className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium">Title *</label><input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.title} onChange={e => setData('title', e.target.value)} /></div>
                                <div><label className="block text-sm font-medium">Assigned To</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}><option value="">Unassigned</option>{employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
                                <div className="col-span-2"><label className="block text-sm font-medium">Description</label><textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.description} onChange={e => setData('description', e.target.value)} /></div>
                                <div><label className="block text-sm font-medium">Start Date</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.start_date} onChange={e => setData('start_date', e.target.value)} /></div>
                                <div><label className="block text-sm font-medium">Due Date</label><input type="date" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.due_date} onChange={e => setData('due_date', e.target.value)} /></div>
                                <div><label className="block text-sm font-medium">Priority</label><select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={data.priority} onChange={e => setData('priority', e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
                                <div className="flex items-end gap-2">
                                    <button type="submit" disabled={processing} className="rounded bg-green-600 px-4 py-2 text-sm text-white">Add</button>
                                    <button type="button" onClick={() => setShowAddTask(false)} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Task</th><th className="px-4 py-3 text-left">Assigned</th><th className="px-4 py-3 text-left">Due</th><th className="px-4 py-3 text-left">Priority</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Action</th></tr></thead>
                        <tbody>
                            {project.tasks?.map((t: any) => (
                                <tr key={t.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{t.title}</td>
                                    <td className="px-4 py-3">{t.employee?.name || '-'}</td>
                                    <td className="px-4 py-3">{t.due_date || '-'}</td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[t.priority]}`}>{t.priority}</span></td>
                                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${taskStatusColors[t.status]}`}>{t.status.replace('_', ' ')}</span></td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            {t.status !== 'done' && <button onClick={() => updateTaskStatus(t.id, t.status === 'todo' ? 'in_progress' : t.status === 'in_progress' ? 'review' : 'done')} className="text-blue-600 hover:underline text-sm">Advance</button>}
                                            <button onClick={() => router.delete(`/projects/tasks/${t.id}`)} className="text-red-600 hover:underline text-sm">x</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!project.tasks?.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No tasks</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
