import {unlink} from 'fs/promises'
export async function removeFile(path) {
    try {
        await unlink(path)
    } catch (e) {
        console.log(`Ошибка удаления файла`, e.message)
    }
}

console.log("test")