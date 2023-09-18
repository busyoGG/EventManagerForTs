# EventManagerForTs
事件管理器

## 使用方法

### 监听
```typescript
EventManager.onEvent(this,"test_event",(res)=>{
    console.log("触发事件",res);
});
```

### 通知

```typescript
EventManager.dispatchEvent("test_event","传入一条消息");
```

### 粘性通知
```typescript
//单条消息 会覆盖
EventManager.dispatchEventSticky("test_event","传入一条消息");
//多条消息 不会覆盖
EventManager.dispatchEventSticky("test_event_2","传入1条消息",true);
EventManager.dispatchEventSticky("test_event_2","传入2条消息",true);
```

### 清除通知
```typescript
//清除this上的所有监听
EventManager.offAllEventByNode(this);
```

详细说明见 [Laya自定义事件系统](https://busyo.buzz/article/1099d6589f61/)