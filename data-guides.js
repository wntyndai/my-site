export const scienceGuide={id:'science',tag:'数据分析工具箱',title:'NumPy / Pandas / Matplotlib 本地环境',html:`
<p>在线实验台会按需加载扩展包，第一次需要网络，后续可复用。暂时不支持上传个人文件；课程用内置文本和程序生成的文件练习。要分析自己的工作簿，请下载代码到本地运行。</p>
<details open><summary>第 1 步：准备专属练习目录与虚拟环境</summary><p>在 VS Code 打开 D:\\codex 下的练习文件夹，再打开 PowerShell 终端。以下是终端命令，不是 Python 代码。</p><pre id="science-install"># 在项目文件夹执行，不必激活环境
py -m venv .venv
.\\.venv\\Scripts\\python.exe -m pip install numpy pandas matplotlib openpyxl
# 核对安装与运行使用同一个解释器
.\\.venv\\Scripts\\python.exe -c "import numpy, pandas, matplotlib; print('ready')"</pre><button class="text-button" data-copy-pre="science-install">复制命令</button><p>预期：安装完成，最后输出 ready。首次安装可能需要等待下载。VS Code 执行「Python: Select Interpreter」，选本项目 .venv 下的 python.exe。</p></details>
<details><summary>第 2 步：读取你自己的 CSV / Excel</summary><p>把脱敏的小文件放在项目目录，修改文件名后保存为 analyze.py。先打印列名和行数，再写清洗规则。</p><pre id="science-local">import pandas as pd
# 二选一，确认真实文件名与工作表名
df = pd.read_csv("orders.csv", encoding="utf-8-sig")
# df = pd.read_excel("orders.xlsx", sheet_name="Sheet1")
print(df.shape)
print(df.columns.tolist())
print(df.head())</pre><button class="text-button" data-copy-pre="science-local">复制 Python 示例</button><p>预期：显示文件实际的行列数量、表头和前 5 行。在终端运行 <code>.\\.venv\\Scripts\\python.exe analyze.py</code>。本地文件与浏览器临时区互相独立，不会自动同步。</p></details>
<details><summary>Seaborn 入门 · 选学，本地运行</summary><p>安装：<code>.\\.venv\\Scripts\\python.exe -m pip install seaborn</code>。下面用每店一条的汇总数据画图，关闭统计误差线（示例需要 Seaborn ≥0.12）。</p><pre id="science-seaborn">import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
# 每个门店一条汇总数据
df = pd.DataFrame({"store": ["A", "B"], "sales": [10, 20]})
ax = sns.barplot(data=df, x="store", y="sales", errorbar=None)
ax.set_title("Store sales")
plt.show()</pre><button class="text-button" data-copy-pre="science-seaborn">复制 Python 示例</button><p>预期：弹出 A=10、B=20 的柱状图。多条观测时，barplot 默认估计均值，不能把它自动当作营业额求和。</p><a href="https://seaborn.pydata.org/generated/seaborn.barplot.html" target="_blank" rel="noopener">Seaborn 官方说明</a></details>
<details><summary>Plotly 交互图 · 选学，本地运行</summary><p>安装：<code>.\\.venv\\Scripts\\python.exe -m pip install plotly</code>。交互图可以悬停查看数值、拖动缩放；本站 Matplotlib 预览是静态图片。</p><pre id="science-plotly">import pandas as pd
import plotly.express as px
# 把时间按顺序排好
df = pd.DataFrame({"day": [1, 2, 3], "sales": [10, 15, 12]})
fig = px.line(df, x="day", y="sales", markers=True)
fig.write_html("interactive.html", include_plotlyjs=True)
print("已保存 interactive.html")</pre><button class="text-button" data-copy-pre="science-plotly">复制 Python 示例</button><p>预期：输出文件名，并生成可用浏览器打开的交互图。请将项目和生成文件放在 D:\\codex 下。</p><a href="https://plotly.com/python/line-charts/" target="_blank" rel="noopener">Plotly 官方折线图教程</a></details>
<details><summary>版本、字体与沙盒限制</summary><ul><li>本站使用固定 Pyodide 0.27.7 环境，运行后显示已加载库版本。本地新版库可能显示不同格式或提示，以实际输出为准。</li><li>代码每次创建新的变量，临时文件在当前 Worker 中可继续读取；刷新、超时、停止执行可能重建 Worker。生成文件请及时下载到 D:\\codex。</li><li>实验台最多预览 4 张静态图；本次新增/修改的文件最多 10 个，每个不超过 3 MB。超过限制的文件请本地生成。</li><li>中文变方框：检查绘图环境实际安装的字体，不要只改编码。网站未预装中文绘图字体，课程图表使用英文标签。</li><li>数据库示例只连接内存 SQLite；生产数据库的账号、驱动和访问权限需要在本地另行配置。</li></ul><a href="https://pyodide.org/en/0.27.7/usage/packages-in-pyodide.html" target="_blank" rel="noopener">在线环境的官方扩展包列表</a></details>`};
