var assert = require('assert')
const GeneratedJs = require('../../../generated/js/catbuffer_generated_output')


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

describe('AccountPropertiesModificationBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.AccountPropertiesModificationBuffer()
        buffer.getModificationtype()
        buffer.setModificationtype(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationTypeBuffer = Buffer.of(0x34)
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(modificationTypeBuffer))
        var buffer = GeneratedJs.AccountPropertiesModificationBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.modificationType, modificationTypeBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationTypeBuffer = Buffer.of(0x34)

        var buffer = new GeneratedJs.AccountPropertiesModificationBuffer()
        buffer.modificationType = modificationTypeBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            modificationTypeBuffer,
        ]))

        done()
    })
})

describe('AccountPropertiesTransactionBodyBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.AccountPropertiesTransactionBodyBuffer()
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
        buffer.getPropertytype()
        buffer.setPropertytype(null)
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
        var propertyTypeBuffer = Buffer.of(0x26)
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyTypeBuffer,
        ])))
        var buffer = GeneratedJs.AccountPropertiesTransactionBodyBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.propertyType, propertyTypeBuffer)
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
        var propertyTypeBuffer = Buffer.of(0x26)

        var buffer = new GeneratedJs.AccountPropertiesTransactionBodyBuffer()
        buffer.size = sizeBuffer
        buffer.signature = signatureBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer
        buffer.fee = feeBuffer
        buffer.deadline = deadlineBuffer
        buffer.property = propertyBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyBuffer,
        ]))

        done()
    })
})

describe('AddressModificationBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.AddressModificationBuffer()
        buffer.getModificationtype()
        buffer.setModificationtype(null)
        buffer.getValue()
        buffer.setValue(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF2)
        var valueBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            modificationTypeBuffer,
            valueBuffer,
        ])))
        var buffer = GeneratedJs.AddressModificationBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.modificationType, modificationTypeBuffer)
        assert.deepEqual(buffer.value, valueBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF2)
        var valueBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18
        )

        var buffer = new GeneratedJs.AddressModificationBuffer()
        buffer.modificationType = modificationTypeBuffer
        buffer.value = valueBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            modificationTypeBuffer,
            valueBuffer,
        ]))

        done()
    })
})

describe('MosaicModificationBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.MosaicModificationBuffer()
        buffer.getModificationtype()
        buffer.setModificationtype(null)
        buffer.getValue()
        buffer.setValue(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF2)
        var valueBuffer = Buffer.of(0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC)
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            modificationTypeBuffer,
            valueBuffer,
        ])))
        var buffer = GeneratedJs.MosaicModificationBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.modificationType, modificationTypeBuffer)
        assert.deepEqual(buffer.value, valueBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF4)
        var valueBuffer = Buffer.of(0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC)

        var buffer = new GeneratedJs.MosaicModificationBuffer()
        buffer.modificationType = modificationTypeBuffer
        buffer.value = valueBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            modificationTypeBuffer,
            valueBuffer,
        ]))

        done()
    })
})

describe('EntityTypeModificationBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.EntityTypeModificationBuffer()
        buffer.getModificationtype()
        buffer.setModificationtype(null)
        buffer.getValue()
        buffer.setValue(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF2)
        var valueBuffer = Buffer.of(0x3E, 0xE9)
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            modificationTypeBuffer,
            valueBuffer,
        ])))
        var buffer = GeneratedJs.EntityTypeModificationBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.modificationType, modificationTypeBuffer)
        assert.deepEqual(buffer.value, valueBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF5)
        var valueBuffer = Buffer.of(0xFA, 0x15)

        var buffer = new GeneratedJs.EntityTypeModificationBuffer()
        buffer.modificationType = modificationTypeBuffer
        buffer.value = valueBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            modificationTypeBuffer,
            valueBuffer,
        ]))

        done()
    })
})

describe('AccountPropertiesAddressTransactionBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.AccountPropertiesAddressTransactionBuffer()
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
        buffer.getPropertytype()
        buffer.setPropertytype(null)
        buffer.getModifications()
        buffer.setModifications(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationBuffer1 = new GeneratedJs.AddressModificationBuffer()
        modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04))
        modificationBuffer1.value = new Uint8Array(Buffer.of(
            0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77,
            0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34
        ))
        var modification1 = modificationBuffer1.serialize()
        var modificationBuffer2 = new GeneratedJs.AddressModificationBuffer()
        modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05))
        modificationBuffer2.value = new Uint8Array(Buffer.of(
            0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33,
            0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44
        ))
        var modification2 = modificationBuffer2.serialize()

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
        var propertyTypeBuffer = Buffer.of(0x26)
        var modificationsCountBuffer = Buffer.of(0x02)
        var modificationsBuffer = Buffer.concat([
            modification1,
            modification2,
        ])
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyTypeBuffer,
            modificationsCountBuffer,
            modificationsBuffer,
        ])))
        var buffer = GeneratedJs.AccountPropertiesAddressTransactionBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.size, sizeBuffer)
        assert.deepEqual(buffer.signature, signatureBuffer)
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.deepEqual(buffer.fee, feeBuffer)
        assert.deepEqual(buffer.deadline, deadlineBuffer)
        assert.deepEqual(buffer.propertyType, propertyTypeBuffer)
        assert.deepEqual(buffer.modifications.length, 2)
        assert.deepEqual(buffer.modifications[0].serialize(), modification1)
        assert.deepEqual(buffer.modifications[1].serialize(), modification2)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationBuffer1 = new GeneratedJs.AddressModificationBuffer()
        modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04))
        modificationBuffer1.value = new Uint8Array(Buffer.of(
            0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77,
            0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34
        ))
        var modification1 = modificationBuffer1.serialize()
        var modificationBuffer2 = new GeneratedJs.AddressModificationBuffer()
        modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05))
        modificationBuffer2.value = new Uint8Array(Buffer.of(
            0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33,
            0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44
        ))
        var modification2 = modificationBuffer2.serialize()

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
        var propertyTypeBuffer = Buffer.of(0x26)
        var modificationsCountBuffer = Buffer.of(0x02)
        var modificationsBuffer = Buffer.concat([
            modification1,
            modification2,
        ])

        var buffer = new GeneratedJs.AccountPropertiesAddressTransactionBuffer()
        buffer.size = sizeBuffer
        buffer.signature = signatureBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer
        buffer.fee = feeBuffer
        buffer.deadline = deadlineBuffer
        buffer.propertyType = propertyTypeBuffer
        buffer.modifications = [modificationBuffer1, modificationBuffer2]

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyTypeBuffer,
            modificationsCountBuffer,
            modificationsBuffer,
        ]))

        done()
    })
})

describe('AccountPropertiesMosaicTransactionBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.AccountPropertiesMosaicTransactionBuffer()
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
        buffer.getPropertytype()
        buffer.setPropertytype(null)
        buffer.getModifications()
        buffer.setModifications(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationBuffer1 = new GeneratedJs.MosaicModificationBuffer()
        modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04))
        modificationBuffer1.value = new Uint8Array(Buffer.of(0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77))
        var modification1 = modificationBuffer1.serialize()
        var modificationBuffer2 = new GeneratedJs.MosaicModificationBuffer()
        modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05))
        modificationBuffer2.value = new Uint8Array(Buffer.of(0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33))
        var modification2 = modificationBuffer2.serialize()

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
        var propertyTypeBuffer = Buffer.of(0x26)
        var modificationsCountBuffer = Buffer.of(0x02)
        var modificationsBuffer = Buffer.concat([
            modification1,
            modification2,
        ])
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyTypeBuffer,
            modificationsCountBuffer,
            modificationsBuffer,
        ])))
        var buffer = GeneratedJs.AccountPropertiesMosaicTransactionBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.size, sizeBuffer)
        assert.deepEqual(buffer.signature, signatureBuffer)
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.deepEqual(buffer.fee, feeBuffer)
        assert.deepEqual(buffer.deadline, deadlineBuffer)
        assert.deepEqual(buffer.propertyType, propertyTypeBuffer)
        assert.deepEqual(buffer.modifications.length, 2)
        assert.deepEqual(buffer.modifications[0].serialize(), modification1)
        assert.deepEqual(buffer.modifications[1].serialize(), modification2)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationBuffer1 = new GeneratedJs.MosaicModificationBuffer()
        modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04))
        modificationBuffer1.value = new Uint8Array(Buffer.of(0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77))
        var modification1 = modificationBuffer1.serialize()
        var modificationBuffer2 = new GeneratedJs.MosaicModificationBuffer()
        modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05))
        modificationBuffer2.value = new Uint8Array(Buffer.of(0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33))
        var modification2 = modificationBuffer2.serialize()

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
        var propertyTypeBuffer = Buffer.of(0x26)
        var modificationsCountBuffer = Buffer.of(0x02)
        var modificationsBuffer = Buffer.concat([
            modification1,
            modification2,
        ])

        var buffer = new GeneratedJs.AccountPropertiesMosaicTransactionBuffer()
        buffer.size = sizeBuffer
        buffer.signature = signatureBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer
        buffer.fee = feeBuffer
        buffer.deadline = deadlineBuffer
        buffer.propertyType = propertyTypeBuffer
        buffer.modifications = [modificationBuffer1, modificationBuffer2]

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyTypeBuffer,
            modificationsCountBuffer,
            modificationsBuffer,
        ]))

        done()
    })
})

describe('AccountPropertiesEntityTypeTransactionBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new GeneratedJs.AccountPropertiesEntityTypeTransactionBuffer()
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
        buffer.getPropertytype()
        buffer.setPropertytype(null)
        buffer.getModifications()
        buffer.setModifications(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationBuffer1 = new GeneratedJs.EntityTypeModificationBuffer()
        modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04))
        modificationBuffer1.value = new Uint8Array(Buffer.of(0x34, 0x77))
        var modification1 = modificationBuffer1.serialize()
        var modificationBuffer2 = new GeneratedJs.EntityTypeModificationBuffer()
        modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05))
        modificationBuffer2.value = new Uint8Array(Buffer.of(0x44, 0x33))
        var modification2 = modificationBuffer2.serialize()

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
        var propertyTypeBuffer = Buffer.of(0x26)
        var modificationsCountBuffer = Buffer.of(0x02)
        var modificationsBuffer = Buffer.concat([
            modification1,
            modification2,
        ])
        var consumableBuffer = new GeneratedJs.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyTypeBuffer,
            modificationsCountBuffer,
            modificationsBuffer,
        ])))
        var buffer = GeneratedJs.AccountPropertiesEntityTypeTransactionBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.size, sizeBuffer)
        assert.deepEqual(buffer.signature, signatureBuffer)
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.deepEqual(buffer.fee, feeBuffer)
        assert.deepEqual(buffer.deadline, deadlineBuffer)
        assert.deepEqual(buffer.propertyType, propertyTypeBuffer)
        assert.deepEqual(buffer.modifications.length, 2)
        assert.deepEqual(buffer.modifications[0].serialize(), modification1)
        assert.deepEqual(buffer.modifications[1].serialize(), modification2)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationBuffer1 = new GeneratedJs.EntityTypeModificationBuffer()
        modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04))
        modificationBuffer1.value = new Uint8Array(Buffer.of(0x34, 0x77))
        var modification1 = modificationBuffer1.serialize()
        var modificationBuffer2 = new GeneratedJs.EntityTypeModificationBuffer()
        modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05))
        modificationBuffer2.value = new Uint8Array(Buffer.of(0x44, 0x33))
        var modification2 = modificationBuffer2.serialize()

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
        var propertyTypeBuffer = Buffer.of(0x26)
        var modificationsCountBuffer = Buffer.of(0x02)
        var modificationsBuffer = Buffer.concat([
            modification1,
            modification2,
        ])

        var buffer = new GeneratedJs.AccountPropertiesEntityTypeTransactionBuffer()
        buffer.size = sizeBuffer
        buffer.signature = signatureBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer
        buffer.fee = feeBuffer
        buffer.deadline = deadlineBuffer
        buffer.propertyType = propertyTypeBuffer
        buffer.modifications = [modificationBuffer1, modificationBuffer2]

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyTypeBuffer,
            modificationsCountBuffer,
            modificationsBuffer,
        ]))

        done()
    })
})
