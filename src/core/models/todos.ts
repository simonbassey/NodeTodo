export default class TodoItem {
    public title: string;
    public description: string;
    public _id?: string;

    constructor() {}
    public setId(id: any): void {
        this._id = id;
    }

    get Id(): string {
        return this._id;
    }
}

export interface DbActionResult {
    status: boolean;
    message: string;
    details?: any;
}
