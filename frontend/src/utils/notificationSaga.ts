import { call, cancelled, put, take } from "redux-saga/effects";
import { EventChannel, eventChannel } from "redux-saga";
import { io } from "socket.io-client";
import {
  createStudentSuccess,
  updateStudentSuccess,
  removeStudentSuccess,
} from "../components/DataGrid/studentSlice";
import { Student } from "./student";

type UserNotification = {
  type: string;
  id: number;
  message: string;
  data: Student | null;
};

function handleNotifications() {
  return eventChannel((emitter) => {
    const socket = io(process.env.REACT_APP_BACKEND_SERVER_URL as string, {
      transports: ["websocket"],
    });
    socket.on("notification", (type: string, id: number, message: string, student: Student) => {
      emitter({
        type: type,
        id: id,
        message: message,
        data: student,
      });
      alert(message);
    });
    return () => {
      socket.close();
    };
  });
}

export default function* notificationSaga() {
  const chan: EventChannel<UserNotification> = yield call(handleNotifications);
  try {
    while (true) {
      const notification: UserNotification = yield take(chan);
      switch (notification.type) {
        case "create":
          yield put(createStudentSuccess(notification.data as Student));
          break;
        case "update":
          yield put(updateStudentSuccess(notification.data as Student));
          break;
        case "delete":
          yield put(removeStudentSuccess(notification.data?.id as number));
          break;
      }
    }
  } finally {
    const val: boolean = yield cancelled();
    if (val) {
      chan.close();
    }
  }
}
