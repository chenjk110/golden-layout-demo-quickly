// @ts-check
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DEMOES_DIR = path.resolve(__dirname, 'demos')

let devServer = null


/**
 * 创建主入口HTMLPlugin
 * @param {string[]} fileList 
 */
const createMainHTMLPlugin = (fileList) => {
	const createCard = (f) => {
		const name = path.parse(f).name
		return `<a href="./${name}">
			<div class="demo-card">${f}</div>
		</a>`
	}

	return new HtmlWebpackPlugin({
		title: 'Demo List',
		templateContent: `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Demo List</title>
			<style>
				.demo-list {
					display: flex;
					flex-wrap: wrap;
				}
				.demo-card {
					padding: 10px;
					margin: 10px;
					border: 1px solid #ddd;
					// width: 50px;
					// height: 50px;
					display: flex;
					justify-content: center;
					align-items: center;
					text-decoration: none;
				}
				.demo-card:hover {
					border-color: orange;
				}
			</style>
		</head>
		<body>
				<div class="demo-list">
					${fileList.map(createCard).join('')}
				</div>
		</body>
		</html>`,
		chunks: ['main']
	})
}

/**
 * 获取文件列表
 * @param {string} dirPath
 */
const createFileList = (dirPath) => {
	const validator = f => f.endsWith('.js')
	return fs.readdirSync(dirPath).filter(validator)
}

/**
 * 创建文件入口
 * @param {string[]} fileList 
 * @returns {Record<string, string>}
 */
const createEntries = (fileList, demosDir) => {
	return fileList.reduce((entries, f) => {
		const name = path.parse(f).name
		entries[name] = `${demosDir}/${f}`
		return entries
	}, {})
}

/**
 * 创建HTML配置
 * @param {string[]} fileList 
 */
const createHTMLPlugins = (fileList) => {
	return fileList.map(f => {
		const name = path.parse(f).name
		return new HtmlWebpackPlugin({
			title: `Demo: ${f}`,
			chunks: [name],
			filename: `${name}/index.html`
		})
	})
}

/**
 * 创建配置项
 * @param {Record<string,string>} entry
 * @param {any[]} plugins
 */
const createWebpackConfig = (entry, plugins) => {
	/**
	 * 配置
	 * @type {import('webpack').Configuration} 
	 */
	const config = {
		mode: 'development',
		entry,
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		},
		plugins
	}

	return config
}


function createDevServer(config, port = 8888, host = 'localhost') {

	const devServer = new WebpackDevServer(
		webpack(config),
		{
			host,
			port,
			noInfo: true,
			watchContentBase: true,
		},
	)

	devServer.listen(port, host, err => {
		if (err) {
			console.error(err.message)
			process.exit(1)
		}

		console.log(`
			Server is running: http://${host}:${port}
		`)
	})

	return devServer
}

const setup = () => {
	const fileList = createFileList(DEMOES_DIR)
	const config = createWebpackConfig(
		createEntries(fileList, DEMOES_DIR),
		[createMainHTMLPlugin(fileList), ...createHTMLPlugins(fileList)]
	)
	devServer = createDevServer(config)
}

fs.watch(DEMOES_DIR, (event) => {
	if (event === 'rename') {
		if (devServer) { devServer.close() }
		setup()
	}
})

setup()
