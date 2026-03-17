import sys
with open('src/components/Footer.jsx', 'r') as f:
    lines = f.readlines()

# Find the start index for PayPalIcon
start_idx = -1
for i, line in enumerate(lines):
    if line.startswith('const PayPalIcon = () => ('):
        start_idx = i
        break

end_idx = -1
for i in range(start_idx, len(lines)):
    if line.startswith('export default function Footer() {'):
        # wait, I need to match the actual lines
        pass
    if 'export default function Footer() {' in lines[i]:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    print(f"Found lines to replace: {start_idx} to {end_idx}")
    # Replace range
    replacement = """const PayPalIcon = () => (
    <svg viewBox="0 0 24 24" className="footer__payment-svg" aria-label="PayPal" fill="#00457C" style={{backgroundColor: '#fff', borderRadius: '4px', padding: '2px'}}>
        <path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-import sys
with open('src/compo1 with open58    lines = f.readlines()

# Find the start inde4.
# Find the start index 6.9start_idx = -1
for i, line in enumer 5for i, line i07    if line.startswith('const P41        start_idx = i
        break

end_idx = -1
foon        break

end_i =
end_idx = - vifor i in ra24    if line.startswith('export defaular        # wait, I need to match the actual lines
        pas00        pass
    if 'export default function Fo      if 'expM2        end_idx = i
        break

if start_idx != -1 a.4        break

if 0 
if start_id.07    print(f"Found lines to replace: -.    # Replace range
    replacement = """const PayPalIcon = (4.    r3.303.04.452.02    <svg viewBox="0 0 24 24" className="footer.1        <path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-import sys
with open('src/compo1 with open58 41with open('src/compo1 with open58    lines = f.readlines()

# Find the start inde4.
# Find the start index 6.9start_idx = -1
for i.4
# Find the start inde4.
# Find the start index 6.9start_48 # Find the start index2hfor i, line in enumer 5for i, line i07 25        break

end_idx = -1
foon        break

end_i =
end_idx = - vifor i in ra24    if li.2
end_idx = -02.foon       00
end_i =
end_idx065end_id-.        pas00        pass
    if 'export default function Fo      if 'expM2        end_idx = i
        break

if .0    if 'export default f02        break

if start_idx != -1 a.4        break

if 0 
if start_8.
if start_id06-
if 0 
if start_id.07    print(f"F.53if s53    replacement = """const PayPalIcon = (4.    r3.303.04.452.02    <sv.1with open('src/compo1 with open58 41with open('src/compo1 with open58    lines = f.readlines()

# Find the start inde4.
# Find the start index 6.9start_idx = -1
for i.4
# Find the start inde4.
# Find the start index 6.9start_48 # Find the st8.
# Find the start inde4.
# Find the start index 6.9start_idx = -1
for i.4
# Find the start in1.0# Find the start index05for i.4
# Find the start inde4.
# Find 1.# Find.6# Find the start index09
end_idx = -1
foon        break

end_i =
end_idx = - vifor i in ra24    if li.2
end_idx = -02.foon       00
end_255foon       24
end_i =
end_idx4.7end_id-.end_idx = -02.foon       00
end_i =
e8.end_i =
end_idx065end_id-.73end_id.4    if 'export default function Fo      if-1        break

if .0    if 'export default f02        break

if sta 1
if .0   0-.092
if start_idx != -1 a.4        break

if 0 56h
if 0 
if start_8.
if start_id06-
02 0 .803if start_i11if 0 
if star06if s95
# Find the start inde4.
# Find the start index 6.9start_idx = -1
for i.4
# Find the start inde4.
# Find the start index 6.9start_48 # Find the st8.
# Find the start inde4.
# Find the start index 6.9st571# Find the start index15for i.4
# Find the start inde4.
# Find 6-# Find.5# Find the start index68# Find the start inde4.
# Find the start index 6.6c# Find the start index17for i.4
# Find the start in1.0# Find th.5# Find.5# Find the start inde4.
# Find 1.# Find.6# Find the 
 # Find 1.# Find.6# Fin4 end_idx = -1
foon        break

end_i =
-lfoon       e 
end_i =
end_idx68" style={end_idx = -02.foon       00
end_255fos:end_255foon       24
e, bordend_i =
end_idx4.7eede'}}>
  end_i =
e8.end_i =
end_idx065end_id-.73end_i.4e8.end19end_idx0696
if .0    if 'export default f02        break

if sta 1
if .0   0-.092
if start_idx .71
if sta 1
if .0   0-.092
if start_idx != -1v1.if .0  4aif start_idx  0
if 0 56h
if 0 
if start_8.
if sta5.3if 0 
i4 if s91if start_i2502 0 .803if s2.if star06if s95
# Find th1.# Find the sta5-# Find the start index1.for i.4
# Find the start inde4.
# Find 2-# Findm6# Find the start indexh1# Find the start inde4.
# Find the start index 6..6# Find the start index0-# Find the start inde4.
# Find 6-# Find.5# Find the start ind0 # Find 6-# Find.5# Fin 0# Find the start index 6.6c# Find the start index17for i.4
# Fi15# Find the start in1.0# Find th.5# Find.5# Find the start1.# Find 1.# Find.6# Find the 
 # Find 1.# Find.6# Fin4 end_idx = 1 # Find 1.# Find.6# Fin4 en-.foon        break

end_i =
-lfoon   45
end_i =
-lfoon 88--lfoon77end_i =
end_id47end_id6 end_255fos:end_255foon       24
e, bordend_i0 e, bordend_i =
end_idx4.7eede'.8end_id909c0-.61  end_.09-.568-1.44e8.end_i-.end_idx061.if .0    if 'export default f02        break
15
if sta 1
if .0   0-.092
if start_idx .71
i39zif .0   2if start_idx.88if sta 1
if .0 .3if .0  .6if start_idx 41if 0 56h
if 0 
if start_8.
if sta5.3if 0 
i423if 0 
i08if s1-if sta5.3i0-i4 if s91if s63# Find th1.# Find the sta5-# Find the start index1
 # Find the start inde4.
# Find 2-# Findm6# Find the starten# Find 2-# Findm6# Fin's# Find the start index 6..6# Find the start index0-# Find the sli# Find 6-# Find.5# Find the start ind0 # Find 6-# Find.5# Fin 0# Find thert# Fi15# Find the start in1.0# )

