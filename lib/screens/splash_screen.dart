import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import 'dart:math';
import '../providers/auth_provider.dart';
import 'login_screen.dart';
import 'staff_dashboard.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _logoScaleAnimation;
  late Animation<double> _logoRotationAnimation;
  late Animation<double> _logoVerticalAnimation;
  late Animation<double> _textOpacityAnimation;
  late Animation<Offset> _textSlideAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    );

    // Logo scale animation (pulsing effect)
    _logoScaleAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.2), weight: 1),
      TweenSequenceItem(tween: Tween(begin: 1.2, end: 1.0), weight: 1),
    ]).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );

    // Logo rotation animation
    _logoRotationAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: -0.05, end: 0.05), weight: 1),
      TweenSequenceItem(tween: Tween(begin: 0.05, end: -0.05), weight: 1),
    ]).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.8, curve: Curves.easeInOut),
      ),
    );

    // Vertical bounce animation
    _logoVerticalAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: -20.0), weight: 1),
      TweenSequenceItem(tween: Tween(begin: -20.0, end: 0.0), weight: 1),
    ]).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );

    // Text opacity animation
    _textOpacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.5, 1.0, curve: Curves.easeIn),
      ),
    );

    // Text slide animation
    _textSlideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.5, 1.0, curve: Curves.easeOutBack),
      ),
    );

    // Start the animation sequence
    _controller.forward().then((_) {
      _controller.repeat(reverse: true);
    });

    // Check auth after animation completes
    Future.delayed(const Duration(seconds: 3), () {
      _checkAuthAndNavigate();
    });
  }

  Future<void> _checkAuthAndNavigate() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.checkAuth();

    if (!mounted) return;

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => authProvider.isAuthenticated
            ? const StaffDashboard()
            : const LoginScreen(),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget _buildParticleBackground() {
    final primaryColor = Theme.of(context).primaryColor;
    
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(12, (index) {
            final angle = 2 * pi * index / 12;
            final radius = MediaQuery.of(context).size.width *
                0.4 *
                (0.5 + _controller.value * 0.5);

            return Positioned(
              left: cos(angle) * radius +
                  MediaQuery.of(context).size.width / 2 -
                  8,
              top: sin(angle) * radius +
                  MediaQuery.of(context).size.height / 2 -
                  60,
              child: Transform.scale(
                scale: 0.5 + _controller.value * 0.5,
                child: Opacity(
                  opacity: 0.5 * (1 - _controller.value),
                  child: Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: primaryColor.withOpacity(0.5),
                    ),
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Particle background
          _buildParticleBackground(),

          // Centered content
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Animated Logo
                AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(0, _logoVerticalAnimation.value),
                      child: Transform.rotate(
                        angle: _logoRotationAnimation.value,
                        child: Transform.scale(
                          scale: _logoScaleAnimation.value,
                          child: Icon(
                            Icons.fastfood,
                            size: 150,
                            color: primaryColor,
                          ),
                        ),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 30),

                // Animated Text
                SlideTransition(
                  position: _textSlideAnimation,
                  child: Opacity(
                    opacity: _textOpacityAnimation.value,
                    child: Text(
                      'Attendx',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: primaryColor,
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Tagline
                SlideTransition(
                  position: _textSlideAnimation,
                  child: Opacity(
                    opacity: _textOpacityAnimation.value,
                    child: Text(
                      'Employee Lunch Management',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}