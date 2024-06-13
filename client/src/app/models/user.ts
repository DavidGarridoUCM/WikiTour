export class user{
    constructor(
        public _id: string,
        public nombre: string,
        public apellidos: string,
        public nick: string,
        public email: string,
        public password: string,
        public fotoPerfil: string,
        public biografia: string,
        public puntuacion: number,
        public rol: string,
        public seguidos: Array<string>,
        public seguidores: Array<string>,
        public bloqueados: Array<string>,
        public notificaciones: Array<string>, //Crear modelos para notificaciones
        public conversaciones: Array<string> // y para conversaciones, mensaje, etc
    ){}
}