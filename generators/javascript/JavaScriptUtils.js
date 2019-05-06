concat_typedarrays = (array1, array2) => {
    var newArray = new Uint8Array(array1.length + array2.length)
    newArray.set(array1)
    newArray.set(array2, array1.length)
    return newArray
}

fit_bytearray = (array, size) => {
    if (array == null) {
        var newArray = new Uint8Array(size)
        newArray.fill(0)
        return newArray
    }
    if (array.length > size) {
        throw new RangeError("Data size larger than allowed")
    }
    else if (array.length < size) {
        var newArray = new Uint8Array(size)
        newArray.fill(0)
        newArray.set(array, size - array.length)
        return newArray
    }
    return array
}

class Uint8ArrayConsumableBuffer {
    constructor(binary) {
        this.offset = 0
        this.binary = binary
    }
    get_bytes(count) {
        if (count + this.offset > this.binary.length) {
            throw new RangeError()
        }
        var bytes = this.binary.slice(this.offset, this.offset + count)
        this.offset += count
        return bytes
    }
}

buffer_to_uint = (buffer) => {
    var dataView = new DataView(buffer.buffer)
    if (buffer.byteLength == 1) {
        return dataView.getUint8(0, true)
    }
    else if (buffer.byteLength == 2) {
        return dataView.getUint16(0, true)
    }
    else if (buffer.byteLength == 4) {
        return dataView.getUint32(0, true)
    }
}

uint_to_buffer = (uint, bufferSize) => {
    var buffer = new ArrayBuffer(bufferSize)
    var dataView = new DataView(buffer)
    if (bufferSize == 1) {
        dataView.setUint8(0, uint, true)
    }
    else if (bufferSize == 2) {
        dataView.setUint16(0, uint, true)
    }
    else if (bufferSize == 4) {
        dataView.setUint32(0, uint, true)
    }
    return new Uint8Array(buffer)
}

module.exports = {
    concat_typedarrays,
    fit_bytearray,
    Uint8ArrayConsumableBuffer,
    buffer_to_uint,
    uint_to_buffer,
};
