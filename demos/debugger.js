import GoldenLayout from 'golden-layout'
import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-dark-theme.css'

/**
 * @typedef ComponentDefinderParams
 * @property {string} name
 * @property {string} title
 * @property {(container:import('golden-layout').Container,componentState:any)} component
 */

/**
 * 定义组件工厂方法
 * @param {ComponentDefinderParams} param0 
 */
function defineComponent({
    name = '',
    title = '',
    component = function () { }
}) {
    Object.defineProperties(component, {
        name: { value: name },
        title: { value: title },
    })
    return component
}

//// 定义组件 ////
const FileExplorer = defineComponent({
    name: 'FileExplorer',
    title: '文件',
    component: function (container) {
        console.log(container.getState())
        container.extendState({ abc: 'hhhh' })
        container.setTitle(container.getState().abc)
        console.log(container)
    }
})

const Properties = defineComponent({
    name: 'Properties',
    title: '属性',
    component: function () { }
})

const CodeEditor = defineComponent({
    name: 'CodeEditor',
    title: '编辑',
    component: function () { }
})

const Console = defineComponent({
    name: 'Console',
    title: '终端',
    component: function () { }
})

///// 创建Layout实例 /////
const myLayout = new GoldenLayout({
    settings: {
        showPopoutIcon: false,
        selectionEnabled: true,
        constrainDragToContainer: true
    },
    dimensions: {
        minItemHeight: 18,
        minItemWidth: 30,
    },
    labels: {
        close: '关闭',
        maximise: '最大化',
        minimise: '恢复',
        popout: '弹出'
    },
    content: [
        {
            type: 'row',
            content: [
                {
                    type: 'component',
                    componentName: FileExplorer.name,
                    title: FileExplorer.title,
                    width: 20,
                    showPopoutIcon: false,
                    isClosable: false,
                },
                {
                    type: 'column',
                    content: [
                        {
                            type: 'component',
                            componentName: CodeEditor.name,
                            title: CodeEditor.title,
                            showPopoutIcon: false,
                            isClosable: false,
                        },
                        {
                            type: 'component',
                            height: 20,
                            componentName: Console.name,
                            title: Console.title,
                            showPopoutIcon: false,
                            isClosable: false,
                        },
                    ]
                },
                {
                    type: 'component',
                    componentName: Properties.name,
                    title: Properties.title,
                    width: 25,
                    showPopoutIcon: false,
                    isClosable: false,
                },
            ]
        }
    ]
})

///// 注册组件 /////
myLayout.registerComponent(FileExplorer.name, FileExplorer) // 文件浏览区域组件
myLayout.registerComponent(Properties.name, Properties) // 属性区域组件
myLayout.registerComponent(CodeEditor.name, CodeEditor) // 代码编辑区域组件
myLayout.registerComponent(Console.name, Console) // 终端区域组件

///// 初始化 /////
myLayout.init()
