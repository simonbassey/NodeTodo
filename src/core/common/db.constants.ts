export class DbContstants {
    public static get Users() { return "users" ; }
    public static get Todos() { return "todos"; }

    public static get Connection() {
        return {
            devConnectionString: "mongodb://localhost:27017/nodeTodoDb"
        };
    }
}
