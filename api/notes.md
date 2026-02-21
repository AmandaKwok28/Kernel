controllers:
    - groups related routes: /users /auth
    - the router determines which controller will handle the HTTP request
    - controllers are built with `decorators` and `classes`

    ```js
    import { Controller, Get, Req } from 'nestjs/common';

    // DTO = data transfer object, below is a DTO schema
    export class CreateCatDto {
        name: string;
        age: number;
        breed: string;
    };


    // 'cats' = the path that all routes in this controller will begin with
    @Controller('cats')                                     // controller decorator defines basic controller
    export class CatsController {                           // controller class
        @Get()                                              // decorator indicates the following method is GET
        findAll(): string {                                 // method name chosen is arbitrary
            return 'This action returns all cats';
        },

        @Get()
        @HttpCode(204)                                      // default is 200, you can specify using @HttpCode
        @Header('Cache-Control', 'no-store')                // can specify a custom header in your response
        findAll(@Req() request: Request): string {          // this version uses @Req decorator to provide
            return 'This action returns all cats';          // access to the request object from Express
        },


        // handling request payloads
        @Post()
        async create(@Body() createCatDto: CreateCatDto) {  // the @Body decorator exposes the request payloads
            return 'This action adds a new cat';            
        },

        // if your query involves complex nested arrays and things like ?filter[where][name]=John&filter...etc.
        // you need to configure your HTTP adapter to use an appropriate query parser
        @Get()
        async findAll(@Query('age') age: number) {          // @Query exposes the query parameters
            return 'This action returns all cats by age';
        }; 

    }

    // at this point, Nest doesn't know about CatsController, it needs to be registered to a module
    // app.module.ts
    import { Module } from 'nestjs/common';
    import { CatsController } from './cats/cats/controller';

    @Module({
        controllers: [CatsController],
    })

    export class AppModule {};

    ```

providers:
    - many basic nest classes like services, repos, factories, and helpers can be treated as 'providers'
    - can be injected as a dependency `@Injectable`
    - def: plain javascript classes with the @Injectable decorator
    - separation of concerns:
        - controllers group the routes
        - providers give re-usable logic / business handling
            - ex: a provider can be a service that exposes a bunch of functions that can send emails,
                  make calls to the orm and perform certain tasks like create a user, etc.
            - wraps things like ORMs or SDKs and does specified business logic things like send emails
    - good for testing, resusability, and dependency injection

    ```js
    // example of a provider
    import { Injectable } from '@nestjs/common';
    import { Cat } from './interfaces/cat.interface';

    @Injectable()
    export class CatsService {
        private readonly cats: Cats[] = [];

        create(cat: Cat) {
            this.cats.push(cat);
        }

        findAll(): Cat[] {
            return this.cats;
        }
    }

    // now back in cats.controller.ts
    import { Controller, Get, Post, Body } from '@nestjs/common';
    import { CreateCatDto } from './dto/create-cat.dto';
    import { CatsService } from './cats.service';                  // the provider
    import { Cat } from './interfaces/cat.interface';

    @Controller('cats') 
    export class CatsController {
        // CatsService is injected through the class constructor
        constructor(private catsService: CatsService) {}

        @Post()
        async create(@Body createCatDto: CreateCatDto) {
            this.catsService.create(createCatDto);
        }

        @Get() 
        async findAll(): Promise<Cat[]> {
            return this.catsService.findAll();
        }
    }
    ```

modules:
    - a class annotated with the `@Module()` decorator
    - `singleton`: means only one instance of this thing exists -> allows everything to have a shared state
    - modules make providers singletons:
        - this means that providers registered in a module are created once and shared across
          that module by default so you only have one instance of that provider
    - @Module decorator takes an object with the following properties:
        - providers: the providers that will be shared across the module
        - controllers: registered to this module and have access to that instance of the provider
        - imports: a list of imported modules that export the providers in this module
            - if a module depends on another module which would happen if a module exports one of your providers
        - exports: a subset of providers that you want to expose to other modules

    ```js
    import { Module } from '@nestjs/common';
    import { CatsController } from './cats.controller';
    import { CatsService } from './cats.service';

    @Module({
        controllers: [CatsController],
        providers: [CatsService],
        exports: [CatsService]          // we're exporting this instance so another module can use the 
    });                                 // exact same instance as this one and share state

    export class CatsModule {};
    ```

    - sharing moduels (they are singletons by default) -> you can share the same instance of any provider
      between mutliple modules. Every module is automatically a shared module.


    - apparently you can also re-export anything that you import in a module so you can share states

    ```js
    @Module({
        imports: [CommonModule],
        exports: [CommonModule]
    })

    export class CoreModule {};
    ```

    - dependency injection: a module can inject providers as well

    ```js 
    import { Module } from '@nestjs/common';
    import { CatsController } from './cats.controller';
    import { CatsService } from './cats.service';

    @Module({
    controllers: [CatsController],
    providers: [CatsService],
    })

    // this means the module itself has access to the cats service whereas in an earlier example,
    // the module only injects CatsService into CatsController and exports it
    // what does doing this enable?
    //      it allows the module to run logic when it's constructed if you want to
    export class CatsModule {
        constructor(private catsService: CatsService) {}   // meaning this module comes with CatsService
    }
    ```

- repository
    - an object that lets you query and manipulate a specific entity in the database

