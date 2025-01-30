import { Component, inject, OnInit, signal, WritableSignal, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TaskService } from '../../../services/task.service'
import { Task } from '../../interfaces/tasks';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule

@Component({
  selector: 'app-tasks-list',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})

export class TasksListComponent implements OnInit{

  private taskService = inject(TaskService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  tasks: WritableSignal<Task[]> = signal<Task[]>([]);

  displayedColumns: string[] = ["id", "nombre", "descripcion", "fechaHoraFinalizacion", "Eliminar"];
  dataSource = new MatTableDataSource<Task>([]);

  ngOnInit(): void {
    this.loadTasks(); 
    
  }

  loadTasks(){
    this.taskService.getTasks().subscribe({
      next: (tasks) =>{
        const filteredTasks = tasks.filter(task => task.estado === "1");

        this.tasks.set(filteredTasks);
        this.updateTableData();
      }
    })
  }

  updateTableData(){
    this.dataSource.data = this.tasks();
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

   // Método para eliminar una tarea
   deleteTask(taskId: number): void {
    console.log('Eliminar tarea con ID:', taskId);
    this.dataSource.data = this.dataSource.data.filter(task => task.id !== taskId);
  }

  markAsComplete(task: any): void {
    // Si la fechaHoraFinalizacion está nula, la marcamos con la fecha actual
    if (!task.fechaHoraFinalizacion) {
      const currentDate = new Date().toISOString(); // Fecha actual en formato ISO
      task.fechaHoraFinalizacion = currentDate; // Asignamos la fecha a la tarea
  
      // Para actualizar la vista de manera inmediata
      const index = this.dataSource.data.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.dataSource.data[index] = { ...task }; // Reemplazamos la tarea con la nueva fecha
      }
  
      // Si tienes un backend, aquí podrías hacer una solicitud para actualizar el registro en el backend.
      // Ejemplo:
      // this.taskService.updateTask(task.id, { fechaHoraFinalizacion: currentDate }).subscribe();
    }
  }



}
