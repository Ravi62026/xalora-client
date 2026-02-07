import axiosInstance from "../utils/axios";
import ApiRoutes from "../routes/routes";

const logCompilerClient = (stage, data = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[CompilerClient][${timestamp}] ${stage}`, data);
};

export const executeCode = async (code, language, input) => {
    const requestId = `exec_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const startedAt = Date.now();
    logCompilerClient("executeCode:start", {
        requestId,
        language,
        codeLength: code?.length || 0,
        inputLength: input?.length || 0,
    });

    try {
        const response = await axiosInstance.post(ApiRoutes.compiler.execute, {
            code,
            language,
            input,
        });

        logCompilerClient("executeCode:success", {
            requestId,
            durationMs: Date.now() - startedAt,
            success: response.data?.success,
            verdict: response.data?.verdict,
            outputLength: response.data?.output?.length || 0,
        });
        return response.data;
    } catch (error) {
        logCompilerClient("executeCode:error", {
            requestId,
            durationMs: Date.now() - startedAt,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            verdict: error.response?.data?.verdict,
        });
        throw error;
    }
};

export const executeTestCases = async (code, language, testCases) => {
    const requestId = `tests_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const startedAt = Date.now();
    logCompilerClient("executeTestCases:start", {
        requestId,
        language,
        codeLength: code?.length || 0,
        testCasesCount: Array.isArray(testCases) ? testCases.length : 0,
    });

    try {
        const response = await axiosInstance.post(ApiRoutes.compiler.executeTests, {
            code,
            language,
            testCases,
        });

        logCompilerClient("executeTestCases:success", {
            requestId,
            durationMs: Date.now() - startedAt,
            success: response.data?.success,
            passed: response.data?.summary?.passed,
            total: response.data?.summary?.total,
            verdict: response.data?.verdict,
        });
        return response.data;
    } catch (error) {
        logCompilerClient("executeTestCases:error", {
            requestId,
            durationMs: Date.now() - startedAt,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            verdict: error.response?.data?.verdict,
        });
        throw error;
    }
};

export const getSupportedLanguages = async () => {
    const requestId = `langs_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const startedAt = Date.now();
    logCompilerClient("getSupportedLanguages:start", { requestId });

    try {
        const response = await axiosInstance.get(ApiRoutes.compiler.languages);
        logCompilerClient("getSupportedLanguages:success", {
            requestId,
            durationMs: Date.now() - startedAt,
            count: response.data?.data?.length || 0,
        });
        return response.data;
    } catch (error) {
        logCompilerClient("getSupportedLanguages:error", {
            requestId,
            durationMs: Date.now() - startedAt,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        });
        throw error;
    }
};
