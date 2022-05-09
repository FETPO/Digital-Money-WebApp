<!DOCTYPE html>
<html lang="en" data-kit-theme="default">

<head>
    <meta charset="utf-8"/>
    <meta name="csrf-token" content="{{csrf_token()}}">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <link href="//fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap" rel="stylesheet"/>
    <link rel="shortcut icon" href="{{asset('favicon.png')}}"/>

    <title>Cryptitan Installer</title>

    <script src="//polyfill.io/v3/polyfill.min.js" type="text/javascript"></script>

    <script type="text/javascript">
        window.__APP__ = @json($data);
    </script>
</head>

<body>
<div id="root">
    <div class="loader-container">
        <div class="loader"></div>
        <noscript>
            <div style="margin-left: 20px;">
                You need to enable JavaScript to run this app.
            </div>
        </noscript>
    </div>
</div>

<script type="text/javascript" src="{{mix('js/index.js')}}"></script>
</body>

</html>
