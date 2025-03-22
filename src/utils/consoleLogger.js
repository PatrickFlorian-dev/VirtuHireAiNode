import chalk from 'chalk';

const consoleLogger = async (message, data, color = '#00FF00') => {
    const colorFn = chalk.hex(color);

    // Handle promises
    if (data instanceof Promise) {
        try {
            data = await data;
        } catch (error) {
            data = `Promise rejected: ${error.message}`;
        }
    }

    // Handle Sequelize instances
    if (data && typeof data.toJSON === 'function') {
        data = data.toJSON();
    }

    // Handle objects
    if (typeof data === 'object') {
        data = JSON.stringify(data, null, 2);
    }

    console.log(`${colorFn(message)}:`, data);
};

export default consoleLogger;
