var assert = require('assert')
const GeneratedJs = require('../../../_generated/js/catbuffer_generated_output')


describe('buffer_to_uint function', function () {
    it('buffer_to_uint converts a 1 byte unsigned integer', function(done) {
        var int8 = 232
        var array8 = new ArrayBuffer(1)
        var array8DataView = new DataView(array8)

        array8DataView.setUint8(0, int8, true)
        var int = GeneratedJs.buffer_to_uint(new Uint8Array(array8))
        assert.equal(int, int8)

        array8DataView.setUint8(0, 0, true)
        var int = GeneratedJs.buffer_to_uint(new Uint8Array(array8))
        assert.equal(int, 0)

        done()
    })

    it('converts a 2 byte unsigned integer', function(done) {
        var int16 = 54345
        var array16 = new ArrayBuffer(2)
        var array16DataView = new DataView(array16)

        array16DataView.setUint16(0, int16, true)
        var int = GeneratedJs.buffer_to_uint(new Uint8Array(array16))
        assert.equal(int, int16)

        array16DataView.setUint16(0, 0, true)
        var int = GeneratedJs.buffer_to_uint(new Uint8Array(array16))
        assert.equal(int, 0)

        done()
    })

    it('converts a 4 byte unsigned integer', function(done) {
        var int32 = 765435
        var array32 = new ArrayBuffer(4)
        var array32DataView = new DataView(array32)
        
        array32DataView.setUint32(0, int32, true)
        var int = GeneratedJs.buffer_to_uint(new Uint8Array(array32))
        assert.equal(int, int32)

        array32DataView.setUint32(0, 0, true)
        var int = GeneratedJs.buffer_to_uint(new Uint8Array(array32))
        assert.equal(int, 0)

        done()
    })
})

describe('uint_to_buffer function', function () {
    it('uint_to_buffer converts an integer to a 1 byte buffer', function(done) {
        var int8 = 233
        var buffer = GeneratedJs.uint_to_buffer(int8, 1)
        assert.equal(buffer.byteLength, 1)
        assert.deepEqual(buffer, [233])
        done()
    })

    it('uint_to_buffer converts an integer to a 2 byte buffer', function(done) {
        var int16 = 54346
        var buffer = GeneratedJs.uint_to_buffer(int16, 2)
        assert.equal(buffer.byteLength, 2)
        assert.deepEqual(buffer, [74, 212])
        done()
    })

    it('uint_to_buffer converts an integer to a 4 byte buffer', function(done) {
        var int32 = 765436
        var buffer = GeneratedJs.uint_to_buffer(int32, 4)
        assert.equal(buffer.byteLength, 4)
        assert.deepEqual(buffer, [252, 173, 11, 0])
        done()
    })
})

describe('concat_typedarrays function', function () {
    it('returns an empty array for two empty array inputs', function(done) {
        var array1 = new Uint8Array([])
        var array2 = new Uint8Array([])
        var result = GeneratedJs.concat_typedarrays(array1, array2)
        assert.deepEqual(Array.from(result), [])
        done()
    })

    it('returns original array if one of the params is empty', function(done) {
        var array1 = new Uint8Array([])
        var array2 = new Uint8Array([23, 54])

        var result = GeneratedJs.concat_typedarrays(array1, array2)
        assert.deepEqual(Array.from(result), Array.from(array2))
        var result2 = GeneratedJs.concat_typedarrays(array2, array1)
        assert.deepEqual(Array.from(result2), Array.from(array2))
        done()
    })

    it('returns the ordered concatenation of both params', function(done) {
        var array1 = new Uint8Array([23, 54])
        var array2 = new Uint8Array([34, 2, 77, 91, 12])

        var result = GeneratedJs.concat_typedarrays(array1, array2)
        assert.deepEqual(Array.from(result), Array.from(array1).concat(Array.from(array2)))
        var result2 = GeneratedJs.concat_typedarrays(array2, array1)
        assert.deepEqual(Array.from(result2), Array.from(array2).concat(Array.from(array1)))
        done()
    })
})

describe('concat_typedarrays function', function () {
    it('throws if data provided is larger than the requested output size', function(done) {
        assert.throws(GeneratedJs.fit_bytearray.bind(GeneratedJs, new Uint8Array([34, 2, 77, 91, 12]), 2), RangeError)
        done()
    })

    it('returns zero-initialized arrays for a null array input', function(done) {
        assert.deepEqual(GeneratedJs.fit_bytearray(null, 0), [])
        assert.deepEqual(GeneratedJs.fit_bytearray(null, 2), [0, 0])
        done()
    })

    it('returns the same array if the parameter size is the same as the parameter array length', function(done) {
        var array1 = new Uint8Array([])
        var array2 = new Uint8Array([34, 2, 77, 91, 12])

        assert.deepEqual(GeneratedJs.fit_bytearray(array1, array1.length), array1)
        assert.deepEqual(GeneratedJs.fit_bytearray(array2, array2.length), array2)
        done()
    })

    it('returns an array of the provided size initialized with trailing 0s if the input array was smaller', function(done) {
        var array1 = new Uint8Array([4])
        var array2 = new Uint8Array([34, 2, 77, 91, 12])

        assert.deepEqual(GeneratedJs.fit_bytearray(array1, 2), [0].concat(Array.from(array1)))
        assert.deepEqual(GeneratedJs.fit_bytearray(array2, 10), [0, 0, 0, 0, 0].concat(Array.from(array2)))
        done()
    })
})

describe('Uint8ArrayConsumableBuffer class', function () {
    it('constructs with buffer offset to 0, and stored array', function(done) {
        var array = new Uint8Array([34, 2, 77, 91, 12])
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(array)
        assert.equal(consumableBuffer.offset, 0)
        assert.deepEqual(consumableBuffer.binary, array)
        done()
    })

    it('get_bytes method throws if requesting more bytes than available', function(done) {
        var array1 = new Uint8Array([])
        var array2 = new Uint8Array([34, 2, 77, 91, 12])
        var consumableBuffer1 = new GeneratedJs.Uint8ArrayConsumableBuffer(array1)
        var consumableBuffer2 = new GeneratedJs.Uint8ArrayConsumableBuffer(array2)

        assert.throws(consumableBuffer1.get_bytes.bind(GeneratedJs.Uint8ArrayConsumableBuffer, array1.length + 1))
        assert.throws(consumableBuffer2.get_bytes.bind(GeneratedJs.Uint8ArrayConsumableBuffer, array2.length + 1))

        consumableBuffer2.offset = 5
        assert.throws(consumableBuffer2.get_bytes.bind(GeneratedJs.Uint8ArrayConsumableBuffer, 1))

        done()
    })

    it('get_bytes method returns requested bytes, and increases offset', function(done) {
        var array = [34, 2, 77, 91, 12]
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(array))

        var firstBatch = 2
        assert.deepEqual(consumableBuffer.get_bytes(firstBatch), array.slice(0, firstBatch))
        assert.equal(consumableBuffer.offset, firstBatch)

        var secondBatch = 3
        assert.deepEqual(consumableBuffer.get_bytes(secondBatch), array.slice(firstBatch, firstBatch + secondBatch))
        assert.equal(consumableBuffer.offset, firstBatch + secondBatch)

        done()
    })
})

describe('MosaicBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.MosaicBuffer()
        buffer.getMosaicid()
        buffer.setMosaicid(null)
        buffer.getAmount()
        buffer.setAmount(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var mosaicIdBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92)
        var mosaicAmountBuffer = Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44)
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            mosaicIdBuffer,
            mosaicAmountBuffer,
        ])))
        var mosaicBuffer = GeneratedJs.MosaicBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(mosaicBuffer.mosaicId, mosaicIdBuffer)
        assert.deepEqual(mosaicBuffer.amount, mosaicAmountBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var mosaicIdBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92)
        var mosaicAmountBuffer = Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44)
        
        var buffer = new GeneratedJs.MosaicBuffer()
        buffer.mosaicId = mosaicIdBuffer
        buffer.amount = mosaicAmountBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            mosaicIdBuffer,
            mosaicAmountBuffer,
        ]))

        done()
    })
})

describe('SizePrefixedEntityBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.SizePrefixedEntityBuffer()
        buffer.getSize()
        buffer.setSize(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(sizeBuffer)
        var buffer = GeneratedJs.SizePrefixedEntityBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(buffer.size, sizeBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        
        var buffer = new GeneratedJs.SizePrefixedEntityBuffer()
        buffer.size = sizeBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer
        ]))

        done()
    })
})

describe('VerifiableEntityBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.VerifiableEntityBuffer()
        buffer.getSignature()
        buffer.setSignature(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var signatureBuffer = Buffer.of(
                0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(signatureBuffer)
        var buffer = GeneratedJs.VerifiableEntityBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(buffer.signature, signatureBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var signatureBuffer = Buffer.of(
                0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )

        var buffer = new GeneratedJs.VerifiableEntityBuffer()
        buffer.signature = signatureBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            signatureBuffer
        ]))

        done()
    })
})

describe('EntityBodyBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.EntityBodyBuffer()
        buffer.getSigner()
        buffer.setSigner(null)
        buffer.getVersion()
        buffer.setVersion(null)
        buffer.getType()
        buffer.setType(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var signerBuffer = Buffer.of(
            0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
        )
        var versionBuffer = Buffer.of(0xF2, 0x26)
        var typeBuffer = Buffer.of(0xFF, 0x34)
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            signerBuffer,
            versionBuffer,
            typeBuffer,
        ])))
        var buffer = GeneratedJs.EntityBodyBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var signerBuffer = Buffer.of(
            0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
        )
        var versionBuffer = Buffer.of(0xF2, 0x26)
        var typeBuffer = Buffer.of(0xFF, 0x34)

        var buffer = new GeneratedJs.EntityBodyBuffer()
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            signerBuffer,
            versionBuffer,
            typeBuffer,
        ]))

        done()
    })
})

describe('TransactionBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.TransactionBuffer()
        buffer.getSize()
        buffer.setSize(null)
        buffer.getSignature()
        buffer.setSignature(null)
        buffer.getSigner()
        buffer.setSigner(null)
        buffer.getVersion()
        buffer.setVersion(null)
        buffer.getType()
        buffer.setType(null)
        buffer.getFee()
        buffer.setFee(null)
        buffer.getDeadline()
        buffer.setDeadline(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signatureBuffer = Buffer.of(
                0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var feeBuffer = Buffer.of(0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF2, 0x06)
        var deadlineBuffer = Buffer.of(0xF2, 0x26, 0x0C, 0x4C, 0xF7, 0xF1, 0x6C, 0x06)
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
        ])))
        var buffer = GeneratedJs.TransactionBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(buffer.size, sizeBuffer)
        assert.deepEqual(buffer.signature, signatureBuffer)
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.deepEqual(buffer.fee, feeBuffer)
        assert.deepEqual(buffer.deadline, deadlineBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signatureBuffer = Buffer.of(
                0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var feeBuffer = Buffer.of(0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF2, 0x06)
        var deadlineBuffer = Buffer.of(0xF2, 0x26, 0x0C, 0x4C, 0xF7, 0xF1, 0x6C, 0x06)

        var buffer = new GeneratedJs.TransactionBuffer()
        buffer.size = sizeBuffer
        buffer.signature = signatureBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer
        buffer.fee = feeBuffer
        buffer.deadline = deadlineBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
        ]))

        done()
    })
})

describe('EmbeddedTransactionBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.EmbeddedTransactionBuffer()
        buffer.getSize()
        buffer.setSize(null)
        buffer.getSigner()
        buffer.setSigner(null)
        buffer.getVersion()
        buffer.setVersion(null)
        buffer.getType()
        buffer.setType(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
        ])))
        var buffer = GeneratedJs.EmbeddedTransactionBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(buffer.size, sizeBuffer)
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)

        var buffer = new GeneratedJs.EmbeddedTransactionBuffer()
        buffer.size = sizeBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
        ]))

        done()
    })
})

describe('TransferTransactionBodyBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.TransferTransactionBodyBuffer()
        buffer.getRecipient()
        buffer.setRecipient(null)
        buffer.getMessage()
        buffer.setMessage(null)
        buffer.getMosaics()
        buffer.setMosaics(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var mosaicBuffer1 = new GeneratedJs.MosaicBuffer()
        mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaicBuffer2 = new GeneratedJs.MosaicBuffer()
        var mosaic1 = mosaicBuffer1.serialize()
        mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaic2 = mosaicBuffer2.serialize()

        var recipientBuffer = Buffer.of(
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
        )
        var messageSizeBuffer = Buffer.of(0x35, 0x00)
        var mosaicsCountBuffer = Buffer.of(0x02)
        var messageBuffer = Buffer.of(
            0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48,
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
            0xAA, 0xBB, 0x55, 0xFF, 0x44
        )
        var mosaicsBuffer = Buffer.concat([
            mosaic1,
            mosaic2,
        ])
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            recipientBuffer,
            messageSizeBuffer,
            mosaicsCountBuffer,
            messageBuffer,
            mosaicsBuffer,
        ])))

        var buffer = GeneratedJs.TransferTransactionBodyBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(buffer.recipient, recipientBuffer)
        assert.deepEqual(buffer.message.length, 53)
        assert.deepEqual(buffer.message, messageBuffer)
        assert.deepEqual(buffer.mosaics.length, 2)
        assert.deepEqual(buffer.mosaics[0].serialize(), mosaic1)
        assert.deepEqual(buffer.mosaics[1].serialize(), mosaic2)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var mosaicBuffer1 = new GeneratedJs.MosaicBuffer()
        mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaicBuffer2 = new GeneratedJs.MosaicBuffer()
        var mosaic1 = mosaicBuffer1.serialize()
        mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaic2 = mosaicBuffer2.serialize()

        var recipientBuffer = Buffer.of(
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
        )
        var messageSizeBuffer = Buffer.of(0x35, 0x00)
        var mosaicsCountBuffer = Buffer.of(0x02)
        var messageBuffer = Buffer.of(
            0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48,
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
            0xAA, 0xBB, 0x55, 0xFF, 0x44
        )
        var mosaicsBuffer = Buffer.concat([
            mosaic1,
            mosaic2,
        ])

        var buffer = new GeneratedJs.TransferTransactionBodyBuffer()
        buffer.recipient = recipientBuffer
        buffer.message = messageBuffer
        buffer.mosaics = [mosaicBuffer1, mosaicBuffer2]

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            recipientBuffer,
            messageSizeBuffer,
            mosaicsCountBuffer,
            messageBuffer,
            mosaicsBuffer,
        ]))

        done()
    })
})

describe('TransferTransactionBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.TransferTransactionBuffer()
        buffer.setSize(null)
        buffer.getSize()
        buffer.setSignature(null)
        buffer.getSignature()
        buffer.setSigner(null)
        buffer.getSigner()
        buffer.setVersion(null)
        buffer.getVersion()
        buffer.setType(null)
        buffer.getType()
        buffer.setFee(null)
        buffer.getFee()
        buffer.setDeadline(null)
        buffer.getDeadline()
        buffer.setRecipient(null)
        buffer.getRecipient()
        buffer.setMessage(null)
        buffer.getMessage()
        buffer.setMosaics(null)
        buffer.getMosaics()
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var mosaicBuffer1 = new GeneratedJs.MosaicBuffer()
        mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaicBuffer2 = new GeneratedJs.MosaicBuffer()
        var mosaic1 = mosaicBuffer1.serialize()
        mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaic2 = mosaicBuffer2.serialize()

        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signatureBuffer = Buffer.of(
                0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var feeBuffer = Buffer.of(0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF2, 0x06)
        var deadlineBuffer = Buffer.of(0xF2, 0x26, 0x0C, 0x4C, 0xF7, 0xF1, 0x6C, 0x06)
        var recipientBuffer = Buffer.of(
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
        )
        var messageSizeBuffer = Buffer.of(0x12, 0x00)
        var mosaicsCountBuffer = Buffer.of(0x02)
        var messageBuffer = Buffer.of(
            0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC,
            0x05, 0xDC
        )
        var mosaicsBuffer = Buffer.concat([
            mosaic1,
            mosaic2,
        ])
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            recipientBuffer,
            messageSizeBuffer,
            mosaicsCountBuffer,
            messageBuffer,
            mosaicsBuffer,
        ])))
        var buffer = GeneratedJs.TransferTransactionBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(buffer.size, sizeBuffer)
        assert.deepEqual(buffer.signature, signatureBuffer)
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.deepEqual(buffer.fee, feeBuffer)
        assert.deepEqual(buffer.deadline, deadlineBuffer)
        assert.deepEqual(buffer.recipient, recipientBuffer)
        assert.deepEqual(buffer.message, messageBuffer)
        assert.deepEqual(buffer.mosaics.length, 2)
        assert.deepEqual(buffer.mosaics[0].serialize(), mosaic1)
        assert.deepEqual(buffer.mosaics[1].serialize(), mosaic2)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var mosaicBuffer1 = new GeneratedJs.MosaicBuffer()
        mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaicBuffer2 = new GeneratedJs.MosaicBuffer()
        var mosaic1 = mosaicBuffer1.serialize()
        mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaic2 = mosaicBuffer2.serialize()

        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signatureBuffer = Buffer.of(
                0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var feeBuffer = Buffer.of(0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF2, 0x06)
        var deadlineBuffer = Buffer.of(0xF2, 0x26, 0x0C, 0x4C, 0xF7, 0xF1, 0x6C, 0x06)
        var recipientBuffer = Buffer.of(
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
        )
        var messageSizeBuffer = Buffer.of(0x12, 0x00)
        var mosaicsCountBuffer = Buffer.of(0x02)
        var messageBuffer = Buffer.of(
            0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC,
            0x05, 0xDC
        )
        var mosaicsBuffer = Buffer.concat([
            mosaic1,
            mosaic2,
        ])

        var buffer = new GeneratedJs.TransferTransactionBuffer()
        buffer.size = sizeBuffer
        buffer.signature = signatureBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer
        buffer.fee = feeBuffer
        buffer.deadline = deadlineBuffer
        buffer.recipient = recipientBuffer
        buffer.message = messageBuffer
        buffer.mosaics = [mosaicBuffer1, mosaicBuffer2]

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            recipientBuffer,
            messageSizeBuffer,
            mosaicsCountBuffer,
            messageBuffer,
            mosaicsBuffer,
        ]))

        done()
    })
})

describe('EmbeddedTransferTransactionBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.EmbeddedTransferTransactionBuffer()
        buffer.getSize()
        buffer.setSize(null)
        buffer.getSigner()
        buffer.setSigner(null)
        buffer.getVersion()
        buffer.setVersion(null)
        buffer.getType()
        buffer.setType(null)
        buffer.getRecipient()
        buffer.setRecipient(null)
        buffer.getMessage()
        buffer.setMessage(null)
        buffer.getMosaics()
        buffer.setMosaics(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var mosaicBuffer1 = new GeneratedJs.MosaicBuffer()
        mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaicBuffer2 = new GeneratedJs.MosaicBuffer()
        var mosaic1 = mosaicBuffer1.serialize()
        mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaic2 = mosaicBuffer2.serialize()
        
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var recipientBuffer = Buffer.of(
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
        )
        var messageSizeBuffer = Buffer.of(0x12, 0x00)
        var mosaicsCountBuffer = Buffer.of(0x02)
        var messageBuffer = Buffer.of(
            0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC,
            0x05, 0xDC
        )
        var mosaicsBuffer = Buffer.concat([
            mosaic1,
            mosaic2,
        ])
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            recipientBuffer,
            messageSizeBuffer,
            mosaicsCountBuffer,
            messageBuffer,
            mosaicsBuffer,
        ])))
        var buffer = GeneratedJs.EmbeddedTransferTransactionBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(buffer.size, sizeBuffer)
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.deepEqual(buffer.recipient, recipientBuffer)
        assert.deepEqual(buffer.message, messageBuffer)
        assert.deepEqual(buffer.mosaics.length, 2)
        assert.deepEqual(buffer.mosaics[0].serialize(), mosaic1)
        assert.deepEqual(buffer.mosaics[1].serialize(), mosaic2)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var mosaicBuffer1 = new GeneratedJs.MosaicBuffer()
        mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaicBuffer2 = new GeneratedJs.MosaicBuffer()
        var mosaic1 = mosaicBuffer1.serialize()
        mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaic2 = mosaicBuffer2.serialize()
        
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var recipientBuffer = Buffer.of(
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
        )
        var messageSizeBuffer = Buffer.of(0x12, 0x00)
        var mosaicsCountBuffer = Buffer.of(0x02)
        var messageBuffer = Buffer.of(
            0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC,
            0x05, 0xDC
        )
        var mosaicsBuffer = Buffer.concat([
            mosaic1,
            mosaic2,
        ])

        var buffer = new GeneratedJs.EmbeddedTransferTransactionBuffer()
        buffer.size = sizeBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer
        buffer.recipient = recipientBuffer
        buffer.message = messageBuffer
        buffer.mosaics = [mosaicBuffer1, mosaicBuffer2]

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            recipientBuffer,
            messageSizeBuffer,
            mosaicsCountBuffer,
            messageBuffer,
            mosaicsBuffer,
        ]))

        done()
    })
})
