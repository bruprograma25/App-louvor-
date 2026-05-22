from flask_socketio import SocketIO


def register_socket_events(socketio: SocketIO):
    @socketio.on("connect")
    def handle_connect():
        print("Cliente conectado")

    @socketio.on("disconnect")
    def handle_disconnect():
        print("Cliente desconectado")
