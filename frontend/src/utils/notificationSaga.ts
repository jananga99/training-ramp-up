import { call, cancelled, put, take } from "redux-saga/effects";
import { EventChannel, eventChannel } from "redux-saga";
import { io } from "socket.io-client";
import {
  createReduxStudent,
  updateReduxStudent,
  removeReduxStudent,
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
          yield put(createReduxStudent(notification.data as Student));
          break;
        case "update":
          yield put(updateReduxStudent(notification.data as Student));
          break;
        case "delete":
          yield put(removeReduxStudent(notification.data?.id as number));
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