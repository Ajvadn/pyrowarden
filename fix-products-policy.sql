-- Fix RLS policy issue and add cybersecurity products
-- This script fixes the infinite recursion in profiles policy and adds products

-- First, let's temporarily disable RLS to add products
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Add cybersecurity products
INSERT INTO public.products (name, description, price, compare_price, sku, stock_quantity, category, tags, status, featured, images) VALUES
(
  'ESP32 WiFi Deauthentication Tool',
  'Preprogrammed ESP32 microcontroller designed for WiFi security testing and deauthentication attacks. Perfect for penetration testing, security research, and educational purposes. Includes custom firmware with advanced WiFi monitoring capabilities.',
  89.99,
  129.99,
  'ESP32-WIFI-DEAUTH-001',
  15,
  'Microcontrollers',
  ARRAY['ESP32', 'WiFi', 'Deauthentication', 'Security', 'Penetration Testing', 'Preprogrammed'],
  'active',
  true,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'USB Rubber Ducky - Advanced Edition',
  'Professional USB Rubber Ducky with custom payloads for penetration testing. Preloaded with cybersecurity scripts for Windows, Linux, and macOS systems. Includes stealth mode and advanced evasion techniques.',
  149.99,
  199.99,
  'USB-RUBBER-DUCKY-ADV-001',
  8,
  'USB Tools',
  ARRAY['USB', 'Rubber Ducky', 'Penetration Testing', 'Payload', 'HID Attack', 'Preprogrammed'],
  'active',
  true,
  ARRAY['/assets/usb-rubber-ducky.webp']
),
(
  'RFID Cloning Kit - Pro',
  'Complete RFID cloning and testing kit with preprogrammed Arduino Nano. Includes multiple RFID cards, reader/writer, and custom firmware for cloning various RFID protocols (125kHz, 13.56MHz).',
  179.99,
  249.99,
  'RFID-CLONING-KIT-PRO-001',
  12,
  'RFID Tools',
  ARRAY['RFID', 'Cloning', 'Arduino', 'Nano', 'Preprogrammed', 'Security Testing'],
  'active',
  false,
  ARRAY['/assets/rfid-tool.webp']
),
(
  'Bluetooth Security Tester',
  'ESP32-based Bluetooth security testing tool with preprogrammed firmware. Capable of Bluetooth scanning, device enumeration, and security assessment. Includes custom payloads for Bluetooth Low Energy testing.',
  119.99,
  159.99,
  'BT-SECURITY-TESTER-001',
  10,
  'Bluetooth Tools',
  ARRAY['Bluetooth', 'ESP32', 'Security Testing', 'BLE', 'Preprogrammed', 'Wireless'],
  'active',
  false,
  ARRAY['/assets/bluetooth-tester.webp']
),
(
  'Badge Flipper - Access Control Testing',
  'Professional badge cloning and access control testing device. Preprogrammed with custom firmware for various card formats including HID, Indala, and other proximity card systems.',
  199.99,
  279.99,
  'BADGE-FLIPPER-PRO-001',
  6,
  'Access Control',
  ARRAY['Badge', 'Cloning', 'Access Control', 'HID', 'Indala', 'Preprogrammed'],
  'active',
  true,
  ARRAY['/assets/badge-flipper.webp']
),
(
  'WiFi Pineapple - Nano',
  'Compact WiFi security testing platform with preloaded penetration testing tools. Features WiFi deauthentication, packet injection, and network monitoring capabilities. Perfect for security professionals and researchers.',
  299.99,
  399.99,
  'WIFI-PINEAPPLE-NANO-001',
  5,
  'WiFi Tools',
  ARRAY['WiFi', 'Pineapple', 'Penetration Testing', 'Deauthentication', 'Network Security'],
  'active',
  true,
  ARRAY['/assets/wifi-testing-device.webp']
),
(
  'Arduino Pro Mini - Security Bundle',
  'Arduino Pro Mini with preprogrammed security testing firmware. Includes multiple payloads for USB attacks, keyboard injection, and device enumeration. Comes with development board and programming cable.',
  79.99,
  109.99,
  'ARDUINO-PRO-MINI-SEC-001',
  20,
  'Microcontrollers',
  ARRAY['Arduino', 'Pro Mini', 'Security', 'USB Attack', 'Preprogrammed', 'HID'],
  'active',
  false,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'Raspberry Pi Zero - Security Edition',
  'Raspberry Pi Zero W with custom security testing OS and preloaded tools. Includes WiFi monitoring, network scanning, and penetration testing software. Perfect for learning and professional security testing.',
  89.99,
  129.99,
  'RPI-ZERO-SEC-001',
  15,
  'Single Board Computers',
  ARRAY['Raspberry Pi', 'Zero W', 'Security', 'WiFi', 'Penetration Testing', 'Preloaded'],
  'active',
  false,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'NFC Testing Kit - Professional',
  'Complete NFC testing and cloning kit with preprogrammed Arduino. Supports NFC-A, NFC-B, and NFC-F protocols. Includes multiple NFC tags and comprehensive testing software.',
  159.99,
  219.99,
  'NFC-TESTING-KIT-PRO-001',
  8,
  'NFC Tools',
  ARRAY['NFC', 'Cloning', 'Testing', 'Arduino', 'Preprogrammed', 'Contactless'],
  'active',
  false,
  ARRAY['/assets/rfid-tool.webp']
),
(
  'Hardware Security Toolkit - Complete',
  'Comprehensive hardware security testing toolkit including ESP32, Arduino Nano, RFID tools, and various connectors. All devices come preprogrammed with security testing firmware and payloads.',
  449.99,
  599.99,
  'HW-SECURITY-TOOLKIT-001',
  3,
  'Toolkits',
  ARRAY['Toolkit', 'Hardware', 'Security', 'Complete', 'Preprogrammed', 'Professional'],
  'active',
  true,
  ARRAY['/assets/hardware-toolkit.webp']
),
(
  'WiFi Deauthentication Module - DIY Kit',
  'DIY kit for building WiFi deauthentication tools. Includes ESP32 board, OLED display, buttons, and custom PCB. Preprogrammed firmware with user-friendly interface for WiFi security testing.',
  69.99,
  99.99,
  'WIFI-DEAUTH-DIY-001',
  25,
  'DIY Kits',
  ARRAY['DIY', 'WiFi', 'Deauthentication', 'ESP32', 'Kit', 'Preprogrammed'],
  'active',
  false,
  ARRAY['/assets/wifi-testing-device.webp']
),
(
  'Keylogger - Educational Kit',
  'Educational keylogger kit for learning about keyboard security. Includes Arduino Leonardo with preprogrammed firmware and detailed documentation. For educational and security research purposes only.',
  49.99,
  79.99,
  'KEYLOGGER-EDU-001',
  30,
  'Educational',
  ARRAY['Keylogger', 'Educational', 'Arduino', 'Leonardo', 'Preprogrammed', 'Security'],
  'active',
  false,
  ARRAY['/assets/hardware-toolkit.webp']
);

-- Now re-enable RLS with a simpler policy
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;

-- Create a simpler admin policy that doesn't cause recursion
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Keep the public view policy
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (status = 'active');

-- Show the added products
SELECT name, category, price, stock_quantity, featured FROM public.products ORDER BY created_at DESC;
