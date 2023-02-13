import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'typeorm';
import { Student } from '../students/entities/student.entity';

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
    transports: ['websocket'],
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  sendNotification(type: string, id: number, student: Student) {
    if (type === 'create' || type === 'update' || type === 'delete') {
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
