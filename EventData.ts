export default class EventInfo {

    public node;
    public event: Function;
    public type: string;

    constructor(node, type: string, event: Function) {
        this.node = node;
        this.event = event;
        this.type = type;
    }
}