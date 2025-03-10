declare var require: any
import { APIRequestContext, APIResponse, expect } from "@playwright/test";

export class JobPortal2Trello {
    readonly request: APIRequestContext;
    readonly baseUrl: string;
    readonly key: string;
    readonly token: string;
    readonly keyTokenPair;
    readonly boardName: string;
    readonly toDoListName: string; 
    readonly stationaryListName: string; 
    boardId: string;
    toDoListId: string;
    stationaryListId: string;
    response: APIResponse;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.baseUrl = 'http://api.trello.com/1/';
        this.key = JSON.parse(JSON.stringify(require("../hidden_data.json"))).trello_key;
        this.token = JSON.parse(JSON.stringify(require("../hidden_data.json"))).trello_token;
        this.keyTokenPair = 'key=' + this.key + '&token=' + this.token;
        this.boardName = 'JB2 tester opgrogramowania';
        this.toDoListName = 'Do zrobienia';
        this.stationaryListName = 'Praca stacjonarna';
    }

    async refreshBoardId(): Promise<void> {
        this.response = await this.request.get(this.baseUrl + 'members/me/boards?' + this.keyTokenPair);
        await this.validateResponse();
        this.boardId = await this.getElementId(this.boardName)
        if(this.boardId == '') {
            await this.createBoard();
            await this.refreshBoardId();
        }
    }

    async refreshToDoListId(): Promise<void> {
        this.response = await this.request.get(this.baseUrl + 'boards/' + this.boardId + '/lists?' + this.keyTokenPair);
        await this.validateResponse();
        this.toDoListId = await this.getElementId(this.toDoListName);
        if(this.toDoListId == '') {
            await this.createToDoList();
            await this.refreshToDoListId();
        } 
    }

    async refreshStationaryListId(): Promise<void> {
        this.response = await this.request.get(this.baseUrl + 'boards/' + this.boardId + '/lists?' + this.keyTokenPair);
        await this.validateResponse();
        this.stationaryListId = await this.getElementId(this.stationaryListName);
        if(this.stationaryListId == '') {
            await this.createStationaryList();
            await this.refreshStationaryListId();
        } 
    }

    async createBoard(): Promise<void> {
        this.response = await this.request.post(this.baseUrl + 'boards/?name=' + this.boardName + '&' + this.keyTokenPair);
        await this.validateResponse();
    }

    async createToDoList(): Promise<void> {
        this.response = await this.request.post(this.baseUrl + 'boards/' + this.boardId + '/lists?name=' + this.toDoListName + '&' + this.keyTokenPair);
        await this.validateResponse();
    }

    async createStationaryList(): Promise<void> {
        this.response = await this.request.post(this.baseUrl + 'boards/' + this.boardId + '/lists?name=' + this.stationaryListName + '&' + this.keyTokenPair);
        await this.validateResponse();
    }

    async validateResponse(): Promise<void> {
        expect(this.response.status()).toBe(200);
        expect(this.response.statusText()).toBe('OK');    
    }

    async getElementId(elementName: string): Promise<string> {
        for(let element of await this.response.json()) {
            if(element.name == elementName) return element.id;
        }
        return '';
    }

    async printObjectsNamesIds(): Promise<void> {
        console.log(this.boardName, ' = ', this.boardId);
        console.log(this.toDoListName, " = ", this.toDoListId);
        console.log(this.stationaryListName, " = ", this.stationaryListId);
    }

    async addCardToToDoList(title: string, link: string): Promise<void> {
        this.response = await this.request.post(this.baseUrl + '/cards/?idList=' + this.toDoListId + '&name=' + title + '&desc=' + link + '&' + this.keyTokenPair);
        await this.validateResponse();
    }

    async addCardToStationaryList(title: string, link: string): Promise<void> {
        this.response = await this.request.post(this.baseUrl + '/cards/?idList=' + this.stationaryListId + '&name=' + title + '&desc=' + link + '&' + this.keyTokenPair);
        await this.validateResponse();
    }
}