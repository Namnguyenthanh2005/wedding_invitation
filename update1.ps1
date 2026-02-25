$html = Get-Content "index.html" -Raw -Encoding UTF8
$find = '<div class="timeline-event">
            <div class="timeline-icon">🏠</div>
            <div class="timeline-content">
              <div class="timeline-time">16:00 - 17:00</div>
              <div class="timeline-title">TIỆC THÂN MẬT</div>
              <div class="timeline-subtitle">FOCENÍ</div>
              <div class="timeline-date">21/3/2026</div>
            </div>
          </div>'
$replace = '<div class="timeline-event">
            <div class="timeline-left">
              <div class="timeline-time">16:00 - 17:00</div>
              <div class="timeline-date">21/3/2026</div>
            </div>
            <div class="timeline-center">
              <div class="timeline-icon">🏠</div>
            </div>
            <div class="timeline-right">
              <div class="timeline-title">TIỆC THÂN MẬT</div>
              <div class="timeline-subtitle">FOCENÍ</div>
            </div>
          </div>'
$html = $html -replace [regex]::Escape($find), $replace
Set-Content "index.html" -Value $html -Encoding UTF8 -NoNewline
Write-Host "Updated event 1"
