import { Socket } from "phoenix";
import { AnnouncementPayload } from "../types";

const SOCKET_URL = "wss://rn.ltrlabsdev.pl/socket";

export const connectToSocket = (
  token: string,
  onAnnouncement: (payload: AnnouncementPayload) => void,
  onConnect: () => void,
  onError: (error: any) => void,
  onClose: () => void
) => {
  const socket = new Socket(SOCKET_URL, { params: { token } });
  socket.connect();

  socket.onOpen(onConnect);
  socket.onError(onError);
  socket.onClose(onClose);

  const channel = socket.channel("games:lobby", {});
  channel.join()
    .receive("ok", () => console.log("Joined lobby"))
    .receive("error", (err) => console.log("Failed to join", err));

  channel.on("announcement", onAnnouncement);

  return { socket, channel };
};
