import axiosInstance from "../utils/axios";
import ApiRoutes from "../routes/routes";

export const executeCode = async (code, language, input) => {
    // Use main server instead of separate compiler service
    const response = await axiosInstance.post(ApiRoutes.compiler.execute, {
        code,
        language,
        input,
    });
    console.log(response.data);
    return response.data;
};

export const executeTestCases = async (code, language, testCases) => {
    // Use main server instead of separate compiler service
    const response = await axiosInstance.post(ApiRoutes.compiler.executeTests, {
        code,
        language,
        testCases,
    });
    return response.data;
};

export const getSupportedLanguages = async () => {
    // Use main server instead of separate compiler service
    const response = await axiosInstance.get(ApiRoutes.compiler.languages);
    return response.data;
};