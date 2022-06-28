import { EXECUTION_CONTEXT_KEY } from './constant';
import Container from './container';
import { ContainerType, HandlerFunction, Identifier, ScopeEnum } from './types';
import { NotFoundError } from './error';

export default class ExecutionContainer extends Container {
    private parent: ContainerType;
    private ctx: any;
    constructor(ctx: any, parent: ContainerType) {
        super('execution');
        this.parent = parent;
        this.ctx = ctx;
        this.set({ id: EXECUTION_CONTEXT_KEY, value: ctx });
    }

    public get<T = unknown>(id: Identifier<T>): T {
        const md = this.getMetadata(id) ?? this.parent.getDefinition(id);
        if (!md) {
            throw new NotFoundError(id);
        }

        const value = this.getValue(md);
        if (md.scope === ScopeEnum.EXECUTION) {
            if (md.id !== md.type) {
              this.set({
                id: md.type!,
                value
              });
            }
            this.set({
              id: md.id,
              value
            });
        }
        return value;
    }

    public async getAsync<T = unknown>(id: Identifier<T>): Promise<T> {
        const md = this.getMetadata(id) ?? this.parent.getDefinition(id);
        if (!md) {
            throw new NotFoundError(id);
        }
        const instance = this.getValue(md);

        await instance[md.initMethod!]?.();
        if (md.scope === ScopeEnum.EXECUTION) {
          if (md.id !== md.type) {
            this.set({
              id: md.type!,
              value: instance
            });
          }
          this.set({
            id: md.id,
            value: instance
          });
        }
        return instance;
    }

    public getCtx(): any {
        return this.ctx;
    }

    public getHandler(name: string): HandlerFunction | undefined {
        return this.handlerMap.get(name) ?? this.parent.getHandler(name);
    }
}
