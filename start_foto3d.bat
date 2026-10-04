@echo off
REM Start een klein webservertje in deze map en opent de 3D-pagina in de browser.
REM Laat dit zwarte venster open zolang je de pagina gebruikt.
cd /d "%~dp0"
set PY=
where py >nul 2>nul && set PY=py
if not defined PY where python >nul 2>nul && set PY=python
if not defined PY if exist "E:\3D_nunif\python\python.exe" set PY="E:\3D_nunif\python\python.exe"
if not defined PY (
  echo Python niet gevonden. Installeer Python van python.org of pas dit bestand aan.
  pause
  exit /b 1
)
start "" http://localhost:8000/foto3d.html
%PY% -m http.server 8000 --bind 127.0.0.1
