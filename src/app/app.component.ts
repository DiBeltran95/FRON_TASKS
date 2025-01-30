import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksListComponent } from "./tasks/components/tasks-list/tasks-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TasksListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'fron-crud-tarea';
}
