import toast from "react-hot-toast";
export const notify = (message, type = "default") => {
    toast.dismiss();
    if (type === "default") {
        toast(message, {
            duration: 2000,
        });
        return;
    }

    toast[type](message, {
        duration: 2000,
    });
};