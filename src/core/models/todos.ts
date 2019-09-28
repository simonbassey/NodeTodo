export default class TodoItem {
    public title: string;
    public description: string;
    private id: string;

    public set setId(id1: any) {
        this.id = id1;
    }

    get Id(): string {
        return this.id;
    }
}

export interface DbActionResult {
    status: boolean;
    message: string;
    details?: any;
}
