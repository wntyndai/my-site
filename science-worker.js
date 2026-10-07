let runtime,excelReady=false;
self.onmessage = async ({data}) => {
 try {
  if(!runtime){
   self.postMessage({id:data.id,status:'loading',message:'首次加载 Python 环境…'});
   const {loadPyodide}=await import('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs');
   runtime=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
  }
  self.postMessage({id:data.id,status:'loading',message:'正在准备所需扩展包；首次运行数据课程可能较慢…'});
  try{await runtime.loadPackagesFromImports(data.code);}
  catch(error){if(!String(error).includes('SyntaxError'))throw error;}
  if(/read_excel|to_excel|import openpyxl|from openpyxl/.test(data.code)&&!excelReady){
   self.postMessage({id:data.id,status:'loading',message:'首次准备 Excel 引擎 openpyxl…'});
   await runtime.loadPackage('micropip');
   await runtime.runPythonAsync("import micropip\nawait micropip.install('openpyxl==3.1.5')");
   excelReady=true;
  }
  if(/\.plot\(/.test(data.code))await runtime.loadPackage('matplotlib');
  runtime.globals.set('__lesson_code',data.code);
  runtime.globals.set('__lesson_input',data.stdin||'');
  runtime.globals.set('__lesson_test',data.test||'');
  self.postMessage({id:data.id,status:'running'});
  const result=await runtime.runPythonAsync(`
import io as _io, json as _json, traceback as _traceback, contextlib as _ctx, builtins as _builtins
import os as _os, sys as _sys, base64 as _base64, hashlib as _hashlib
_os.chdir('/home/pyodide')
_plt = None
if 'matplotlib' in _sys.modules or 'matplotlib' in __lesson_code or '.plot(' in __lesson_code:
    try:
        import matplotlib as _mpl
        _mpl.use('Agg', force=True)
        import matplotlib.pyplot as _plt
        _plt.close('all')
        _mpl.rcdefaults()
        _plt.show = lambda *args, **kwargs: None
    except ImportError:
        pass
_allowed = ('.csv', '.xlsx', '.json', '.npy', '.txt', '.png', '.pdf', '.svg')
def _file_state():
    result = {}
    for name in _os.listdir('.'):
        if name.lower().endswith(_allowed) and _os.path.isfile(name) and _os.path.getsize(name) <= 3000000:
            with open(name, 'rb') as handle:
                content = handle.read()
            result[name] = (content, (_hashlib.sha256(content).hexdigest(), _os.stat(name).st_mtime_ns))
    return result
_before = _file_state()
class _LimitedOutput(_io.StringIO):
    def write(self, text):
        if self.tell() + len(text) > 50000:
            raise RuntimeError('输出超过 50000 字符，请缩小循环或减少打印。')
        return super().write(text)
_buffer = _LimitedOutput()
_lines = iter(__lesson_input.splitlines())
def _read_input(prompt=''):
    print(prompt, end='')
    try:
        return next(_lines)
    except StopIteration:
        raise EOFError('程序输入不够，请每行填写一个答案。') from None
_scope = {'__name__': '__main__', '__builtins__': dict(vars(_builtins), input=_read_input)}
_error, _passed, _message = '', None, ''
_figures, _files = [], []
try:
    with _ctx.redirect_stdout(_buffer), _ctx.redirect_stderr(_buffer):
        exec(compile(__lesson_code, '<学习代码>', 'exec'), _scope)
except BaseException:
    _error = _traceback.format_exc()
_output = _buffer.getvalue()
if __lesson_test and not _error:
    try:
        with _ctx.redirect_stdout(_io.StringIO()):
            exec(__lesson_test, {'scope': _scope, 'output': _output})
        _passed = True
    except BaseException as _e:
        _passed = False
        _message = str(_e) or '检查变量类型和输出是否符合题目要求。'
if _plt is not None:
    try:
        for _num in _plt.get_fignums()[:4]:
            _fig = _plt.figure(_num)
            _image = _io.BytesIO()
            with _ctx.redirect_stderr(_io.StringIO()):
                _fig.savefig(_image, format='png', dpi=110, bbox_inches='tight')
            if _image.tell() <= 5000000:
                _figures.append(_base64.b64encode(_image.getvalue()).decode('ascii'))
    except BaseException as _e:
        _output += '\\n图表导出失败：' + str(_e)
    finally:
        _plt.close('all')
for _name, (_content, _digest) in _file_state().items():
    if _name not in _before or _digest != _before[_name][1]:
        if len(_files) < 10:
            _files.append({'name': _name, 'data': _base64.b64encode(_content).decode('ascii'), 'size': len(_content)})
_versions = {name: str(getattr(_sys.modules[name], '__version__', '')) for name in ['numpy','pandas','matplotlib'] if name in _sys.modules}
_json.dumps({'output': _output, 'error': _error, 'passed': _passed, 'testMessage': _message, 'figures': _figures, 'files': _files, 'versions': _versions}, ensure_ascii=False)
`);
  self.postMessage({id:data.id,status:'result',...JSON.parse(result)});
 }catch(error){self.postMessage({id:data.id,status:'failed',error:String(error?.message||error)});}
};
