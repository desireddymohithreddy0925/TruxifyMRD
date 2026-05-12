import 'package:flutter/material.dart';

import 'controllers/app_controller.dart';
import 'screens/splash_screen.dart';
import 'theme/app_theme.dart';

class FreightFairApp extends StatefulWidget {
  const FreightFairApp({super.key});

  @override
  State<FreightFairApp> createState() => _FreightFairAppState();
}

class _FreightFairAppState extends State<FreightFairApp> {
  late final FreightFairController _controller;

  @override
  void initState() {
    super.initState();
    _controller = FreightFairController();
    _controller.addListener(_onControllerChanged);
  }

  void _onControllerChanged() {
    setState(() {});
  }

  @override
  void dispose() {
    _controller.removeListener(_onControllerChanged);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FreightFairScope(
      controller: _controller,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'FreightFair',
        theme: FreightFairTheme.light(),
        darkTheme: FreightFairTheme.dark(),
        themeMode: _controller.isDarkMode ? ThemeMode.dark : ThemeMode.light,
        home: const SplashScreen(),
      ),
    );
  }
}
