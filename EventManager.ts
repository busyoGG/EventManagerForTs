import EventInfo from "./EventData";

export default class EventManager {
    /** 事件id */
    private static _eventId = 1;
    /** 事件字典 类型-节点-事件 */
    private static _eventDic = {};
    /** 节点对应事件 节点-事件 */
    private static _nodeEventDic = {};
    /** 粘性通知字典 */
    private static _stickyArr = {};

    /**
     * 发送监听
     * @param type  监听类型 
     * @param data 发送的数据
     */
    public static dispatchEvent(type, data): void {
        for (let key in this._eventDic[type]) {
            let event = this._eventDic[type][key] as EventInfo;
            event.event.call(event.node, data);
        }
    }

    /**
     * 粘性通知
     * @param type 
     * @param data 
     */
    public static dispatchEventSticky(type, data, isArr?) {
        let eventOk = false;
        //普通通知部分
        for (let key in this._eventDic[type]) {
            let event = this._eventDic[type][key] as EventInfo;
            event.event.call(event.node, data);
            eventOk = true;
        }
        //如果没有执行普通通知，则保存通知内容
        if (!eventOk) {
            if (isArr) {
                if (!this._stickyArr[type]) {
                    this._stickyArr[type] = [];
                }
                this._stickyArr[type].push(data);
            } else {
                this._stickyArr[type] = data;
            }
        }
    }

    /**
     * 注册监听
     * @param node  监听的节点 
     * @param type  监听类型
     * @param event 监听事件
     */
    public static onEvent(node, type: string, event: Function) {
        var obj = new EventInfo(node, type, event);

        if (!this._eventDic[type]) {
            this._eventDic[type] = {};
        }
        //如果节点上没有事件id，则添加
        if (node.eventId == undefined) {
            node.eventId = "event_" + this._eventId++;
        }
        //添加事件
        this._eventDic[type][node.eventId] = obj;
        //获取粘性通知数据
        let data = this._stickyArr[type];
        if (data) {
            //根据是否数组决定是否多次执行事件
            if (data.length) {
                let event = this._eventDic[type][node.eventId] as EventInfo;
                for (let i = 0, len = data.length; i < len; i++) {
                    event.event.call(event.node, data[i]);
                }
                delete this._stickyArr[type];
            } else {
                let event = this._eventDic[type][node.eventId] as EventInfo;
                event.event.call(event.node, data);
                delete this._stickyArr[type];
            }
        }
        //汇总节点上的所有事件
        if (!this._nodeEventDic[node.eventId]) {
            this._nodeEventDic[node.eventId] = {};
        }

        this._nodeEventDic[node.eventId][type] = true;

    }

    /**
    * 清除某一节点上的所有监听
    * @param node 
    */
    public static offAllEventByNode(node) {
        if (!node || !this._nodeEventDic[node.eventId]) return;
        for (let key in this._nodeEventDic[node.eventId]) {
            delete this._eventDic[key][node.eventId];
            if (Object.keys(this._eventDic[key]).length == 0) {
                delete this._eventDic[key];
            }
        }

        delete this._nodeEventDic[node.eventId];
    }
}