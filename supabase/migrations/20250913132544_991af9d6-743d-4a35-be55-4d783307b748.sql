-- Add sample data for testing admin functionality

-- Sample products
INSERT INTO public.products (name, description, price, compare_price, sku, stock_quantity, category, tags, status, featured, images) VALUES
('Badge Flipper Kit', 'Professional badge flipping device for security testing and penetration testing', 89.99, 129.99, 'BFK-001', 25, 'Security Tools', ARRAY['RFID', 'Security', 'Testing'], 'active', true, ARRAY['/images/badge-flipper.jpg']),
('Bluetooth Signal Analyzer', 'Advanced Bluetooth signal analysis tool for wireless security auditing', 149.99, NULL, 'BSA-002', 15, 'Wireless Tools', ARRAY['Bluetooth', 'Analysis', 'Security'], 'active', false, ARRAY['/images/bluetooth-analyzer.jpg']),
('Hardware Toolkit Pro', 'Complete hardware testing toolkit for cybersecurity professionals', 299.99, 349.99, 'HTP-003', 8, 'Hardware Tools', ARRAY['Hardware', 'Testing', 'Professional'], 'active', true, ARRAY['/images/hardware-toolkit.jpg']),
('USB Rubber Ducky', 'Keystroke injection tool for penetration testing', 59.99, NULL, 'URD-004', 30, 'USB Tools', ARRAY['USB', 'Keystroke', 'Testing'], 'active', false, ARRAY['/images/usb-ducky.jpg']),
('WiFi Pineapple Device', 'Wireless auditing platform for network security testing', 199.99, 249.99, 'WPD-005', 12, 'Wireless Tools', ARRAY['WiFi', 'Auditing', 'Network'], 'active', true, ARRAY['/images/wifi-pineapple.jpg'])
ON CONFLICT (name) DO NOTHING;

-- Sample internships
INSERT INTO public.internships (title, description, requirements, responsibilities, duration, location, type, department, salary_range, benefits, status, max_applications, start_date, end_date) VALUES
('Cybersecurity Research Intern', 'Join our team to research the latest cybersecurity threats and develop innovative solutions for enterprise security.', 
 ARRAY['Currently pursuing degree in Computer Science, Cybersecurity, or related field', 'Knowledge of Python, C++, or similar programming languages', 'Understanding of network protocols and security principles', 'Strong analytical and problem-solving skills'],
 ARRAY['Conduct security research on emerging threats', 'Assist in developing security tools and frameworks', 'Analyze malware samples and attack vectors', 'Document findings and present to team'],
 '3 months', 'Remote', 'remote', 'Research & Development', '$20-25/hour', 
 ARRAY['Flexible working hours', 'Mentorship from senior researchers', 'Access to cutting-edge security tools', 'Certificate of completion'],
 'open', 10, '2025-01-15', '2025-04-15'),

('Hardware Security Intern', 'Work with our hardware team to test and secure IoT devices and embedded systems.',
 ARRAY['Electrical Engineering or Computer Engineering student', 'Experience with Arduino, Raspberry Pi, or similar platforms', 'Knowledge of circuit analysis and digital systems', 'Interest in hardware security and IoT'],
 ARRAY['Test hardware devices for security vulnerabilities', 'Develop secure firmware and bootloaders', 'Perform hardware reverse engineering', 'Create documentation and test reports'],
 '6 months', 'Hybrid - San Francisco', 'hybrid', 'Hardware Engineering', '$22-28/hour',
 ARRAY['Hybrid work model', 'Access to professional lab equipment', 'Training on advanced hardware tools', 'Networking opportunities'],
 'open', 5, '2025-02-01', '2025-07-31'),

('Web Application Security Intern', 'Help identify and fix security vulnerabilities in web applications and APIs.',
 ARRAY['Computer Science or related field student', 'Knowledge of web technologies (HTML, CSS, JavaScript, Node.js)', 'Familiarity with OWASP Top 10', 'Experience with Burp Suite or similar tools'],
 ARRAY['Perform web application penetration testing', 'Develop automated security testing scripts', 'Review code for security vulnerabilities', 'Work with development team on security fixes'],
 '4 months', 'Remote', 'remote', 'Application Security', '$18-22/hour',
 ARRAY['Remote work flexibility', 'Access to premium security tools', 'Certification training opportunities', 'Career development mentoring'],
 'open', 8, '2025-01-20', '2025-05-20')
ON CONFLICT (title) DO NOTHING;