export class user{
    constructor(
        public _id: string,
        public nombre: string,
        public apellidos: string,
        public nick: string,
        public email: string,
        public fotoPerfil: string,
        public biografia: string,
        public puntuacion: number,
        public rol: string,
        public numSeguidos: number,
        public numSeguidores: number,
        public publicaciones: number 
    ){}
}