<tr>
<td class="header">
<a href="{{ $url }}">
@if (settings()->brand->has('logo_url'))
<img src="{{settings()->brand->get('logo_url')}}" class="logo" alt="{{ $slot }}">
@endif
</a>
</td>
</tr>
