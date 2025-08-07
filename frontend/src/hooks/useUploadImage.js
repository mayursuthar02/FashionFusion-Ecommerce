const cloudName = import.meta.env.VITE_CLOUD_NAME_CLOUDINARY;
const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const useUploadImage = async(image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "fashion_fusion");

    try {
        const dataResponse = await fetch(url, {
            method: "POST",
            body: formData
        });

        const json = await dataResponse.json(); // ✅ Read only once
        console.log(json);                      // ✅ Log it
        return json;                            // ✅ Return it
        
    } catch (error) {
        console.log(error);
    }

}

export default useUploadImage;