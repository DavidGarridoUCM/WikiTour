export class publi{
    constructor( 
            public _id : string,
            public usuario : string, 
            public titulo : string, 
            public etapas : Array<etapa>, 
            public fecha : string, 
            public numlikes : number, 
            public likes : Array<String>,
            public comentarios : Array<comentario>, 
            public puntuacion : number, 
            public ciudad : string, 
            public continente : string, 
            public pais : string
    ){}
}


//Se cambia la etapa directamente, tambien podria haber propuestos y aceptarlos

class etapa{
    constructor(
        public _id : string,
        public titulo : string,
        public texto : string,
        public adjuntos : Array<string>,
        public usuario : string
    ){}
}

class comentario{
    constructor(
        public _id : string,
        public texto : string,
        public likes: number
    ){}
}
