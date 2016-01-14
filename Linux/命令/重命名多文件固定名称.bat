@Echo off
setlocal enabledelayedexpansion
for /f "delims=" %%a in ('dir /s /b /a-d') do (
 if "%%~sa" neq "%~s0" (
  set "xz=%%~nxa"
  set xz=!xz:[大家网]=!

echo xz:[大家网]
  attrib -s -h -r %%~sa 2>nul &&ren %%~sa "!xz!" 2>nul
))
pause 

保存为BAT文件后，在视频所在文件夹运行 
要是VISTA或WIN7系统，右键“以管理员身份运行”BAT文件