import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class TaskService extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where({ user });

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(`Task with id:${id} not found`);
    }
    return found;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.create({
      title,
      description,
      isActive: true,
      user,
    });

    await this.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<Task> {
    const found = await this.getTaskById(id, user);

    return await this.remove(found);
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const found = await this.getTaskById(id, user);

    const task = { ...found, ...updateTaskDto };

    return await this.save(task);
  }
}
