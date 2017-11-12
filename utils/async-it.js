// a simple utility that allows you to take Promise
// based functions and wrap them in async/await
export const asyncIt = async (call) => {
    try{
        return new Promise((resolve, reject) => {
            try {
                call((error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    } catch (e){
        return e;
    }
}