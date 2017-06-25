import List from '../List';

describe('List functor', () => {

    it('should have an identity function', () => {
        List([1, 2, 3]).valueOf().should.deep.equal([1, 2, 3])
    })

    it('should be a functor, thus have a map function that applies to all its arguments', () => {
        List([1, 2, 3]).map(a => a * 2).valueOf().should.deep.equal([2, 4, 6])
    })

    it('should be an iterable', () => {
        const list = List([1, 2, 3])
        const actual = [...list, 4]
        actual.should.deep.equal([1, 2, 3, 4])
    })

    it('should destructure to an array', () => {
        const actual = [...List([1, 2])]
        actual.should.deep.equal([1, 2])
    })

    it('should destructure to an empty array when empty', () => {
        const actual = [...List([])]
        actual.should.deep.equal([])
    })

    it('should throw an error if initialized with something other than an array', () => {
        List.should.throw(Error)
        List.bind(null, 2).should.throw(Error)
    })

    it('should return a List after tracing its contents', () => {
        const list = List([1, 2, 3]).trace()
        list.should.have.property('without')
        list.should.have.property('isEmpty')
        list.should.have.property('contains')
        list.should.have.property('when')
    })

    describe('List.without', () => {
        it('should filter one item', () => {
            const list = List([1, 2, 3])
            const expected = List([1, 2]).valueOf()
            list.without(3).valueOf().should.deep.equal(expected)
        })

        it('should filter all items that are equal', () => {
            const list = List([1, 2, 2, 1])
            const expected = List([1, 1]).valueOf()
            list.without(2).valueOf().should.deep.equal(expected)
        })
    })

    describe('List.isEmpty', () => {
        it('should return true for an empty list', () => {
            List([]).isEmpty().should.be.ok
        })

        it('should return false for a non empty list', () => {
            List([1]).isEmpty().should.not.be.ok
        })
    })

    describe('List.contains', () => {
        it('should return true if an item is found once in the list', () => {
            List([1]).contains(1).should.be.ok
        })

        it('should return true if an item is found several times', () => {
            List([1, 1, 1]).contains(1).should.be.ok
        })

        it('should return false if an item is not found in the list', () => {
            List([1]).contains(2).should.not.be.ok
        })
    })

    describe('List.when', () => {
        it('should do nothing if the condition is not fulfilled', () => {
            const actual = List([1]).when(false).append(2).valueOf()
            const actual2 = List([1]).when(false).prepend(2).valueOf()
            const expected = List([1]).valueOf()
            actual.should.deep.equal(expected)
            actual2.should.deep.equal(expected)
        })

        it('should append a value if the condition is true', () => {
            const actual = List([1]).when(true).append(2).valueOf()
            const expected = List([1, 2]).valueOf()
            actual.should.deep.equal(expected)
        })

        it('should prepend a value if the condition is true', () => {
            const actual = List([1]).when(true).prepend(2).valueOf()
            const expected = List([2, 1]).valueOf()
            actual.should.deep.equal(expected)
        })
    })
})
