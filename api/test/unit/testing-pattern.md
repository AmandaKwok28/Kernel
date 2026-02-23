```js
// 1. identify an overarching class of tests: update route -> updating a file


describe('updating a file', () => {

    // 2. is there anything that needs to be set up before each test? ex: a query builder
    beforeEach(() => {

    });

    // 3. is there anything that needs to be cleaned up?
    afterEach(() => {

    })

    // 4. identify the branches of this function, ex: updating a file with invalid folder id
    it('updating file with invalid folder id', async () => {

        // 5. mock any data you'll be operating on

        // 6. mock the resolved value for any repository functions your service may call as a part of its business logic

        // 7. make the service call

        // 8. check the business logic using .toHaveBeenCalledWith() and .toHaveBeenCalled()

        // 9. check the expected return values

        //      - this includes any exception types that were thrown

        //      - also includes the exception messages

    })
    
})