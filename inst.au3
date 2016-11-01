#cs ----------------------------------------------------------------------------

 AutoIt Version: 3.3.14.1
 Author:         josch

 Script Function:
	Install the plugin references

#ce ----------------------------------------------------------------------------

#include <File.au3>
#include <MsgBoxConstants.au3>

Local $sFileName = Null

; check if there is a standalone version on this computer
Local $home = @HomeDrive&@HomePath
if FileExists ($home&"\.counterplay\duelyst") Then
	Local $duelyst_version_dir = _FileListToArray ( $home&"\.counterplay\duelyst")[1]
	Local $sFileName = $home & "\.counterplay\duelyst\" & $duelyst_version_dir & "\resources\app\src\index.html"

	MsgBox(0,"Duelyst installation found", $sFileName)
EndIf

	;$sFileName = Null

; if there is no stand alone installation, ask the user to select the index.html in the duelyst src dir
If $sFileName == Null Then
	$sFileName = FileOpenDialog ( "SELECT index.html WITHIN YOUR DUELYST SRC DIR" , @ScriptDir, 'HTML files (*.html)')
EndIf

Local $sFind = '<script src=vendor.js crossorigin></script><script src=duelyst.js crossorigin></script>'
Local $sReplace = @CRLF & '<script src=vendor.js crossorigin></script>' & @CRLF & '<script src=plugins.js crossorigin></script>' & @CRLF &'<script src=duelyst.js crossorigin></script>' & @CRLF &'<script src=plugins.js crossorigin></script>' & @CRLF

Local $iRetval = _ReplaceStringInFile($sFileName, $sFind, $sReplace)

If $iRetval = -1 Then
	MsgBox($MB_SYSTEMMODAL, "ERROR", "Something went wrong")
ElseIf $iRetval = 0 Then
	MsgBox($MB_SYSTEMMODAL, "Already installed?", "It looks like everything is already installed")

	Local $file = FileOpen($sFileName, 0)
	Local $read = FileRead($file)
	Local $matches = StringRegExp($read, '(?s)(<\N*vendor\.js.*)<.*js\.stripe', $STR_REGEXPARRAYFULLMATCH )
	Local $res = $matches[1]
	MsgBox(0, "The interesting part looks like this", $res)

	FileClose($file)
Else
	MsgBox($MB_SYSTEMMODAL, "SUCCESS!", "Installed plugin references to index.html")
EndIf

