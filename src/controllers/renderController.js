const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_BASE_URL = 'https://api.render.com/v1';

exports.updateEnvVars = async (req, res) => {
    try {
        const { serviceId, updates } = req.body;

        const response = await fetch(`${RENDER_BASE_URL}/services/${serviceId}/env-vars`, {
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
