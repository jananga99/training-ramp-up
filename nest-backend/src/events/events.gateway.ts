import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { UpdateStudentDto } from '../students/dto/update-student.dto';
import { EventTypeName } from './events.const';

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
    transports: ['websocket'],
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  sendNotification(
    type: string,
    id: number,
    student: Student | UpdateStudentDto,
  ): void {
    if (
      type === EventTypeName.CREATE ||
      type === EventTypeName.UPDATE ||
      type === EventTypeName.DELETE
    ) {
      this.server.emit(
        'notification',
        type,
        id,
        `Student with database id ${id} was ${type}d.`,
        student,
      );
    }
  }
}
