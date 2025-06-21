const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_BASE_URL = 'https://api.render.com/v1';

exports.updateEnvVars = async (req, res) => {
    try {
        const { updates } = req.body;
        const SERVICE_ID = 'prj-srv-d17dod0dl3ps73ablia0';

        const response = await fetch(`${RENDER_BASE_URL}/services/${SERVICE_ID}/env-vars`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${RENDER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ envVars: updates }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        res.json({
            status: 'success',
            message: 'Cập nhật thành công',
            data: data,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update Render env vars' });
    }
};

// ✅ GET tất cả env
exports.getAllEnv = async (req, res) => {
    const SERVICE_ID = 'srv-d17dod0dl3ps73ablia0';
    try {
        const response = await fetch(`${RENDER_BASE_URL}/services/${SERVICE_ID}/env-vars`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${RENDER_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({
                status: 'success',
                data: data,
            });
        } else {
            return res.status(response.status).json({
                status: 'error',
                message: data.message || 'Lỗi khi lấy env vars!',
            });
        }
    } catch (err) {
        console.error('getAllEnv error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Lỗi server!',
        });
    }
};

// ✅ DELETE 1 env theo key
exports.deleteEnv = async (req, res) => {
    try {
        const { key } = req.body;
        const SERVICE_ID = 'srv-d17dod0dl3ps73ablia0';

        const response = await fetch(`${RENDER_BASE_URL}/services/${SERVICE_ID}/env-vars/${key}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${RENDER_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return res.status(200).json({
                status: 'success',
                message: `Đã xoá env key: ${key}`,
            });
        } else {
            const data = await response.json();
            return res.status(response.status).json({
                status: 'error',
                message: data.message || 'Xoá env thất bại!',
            });
        }
    } catch (err) {
        console.error('deleteEnv error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Lỗi server!',
        });
    }
};

