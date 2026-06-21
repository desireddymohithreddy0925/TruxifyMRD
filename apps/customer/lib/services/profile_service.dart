import 'dart:convert';
import '../core/api_client.dart';
import 'supabase_service.dart';

class ProfileService {
  ProfileService({
    ApiClient? apiClient,
  }) : _apiClient = apiClient ?? ApiClient();

  final ApiClient _apiClient;

  Future<Map<String, dynamic>> fetchProfile() async {
    final userId = SupabaseService.requireUserId();
    final fullName = SupabaseService.currentUser?.userMetadata?['full_name']?.toString();

    final headers = <String, String>{
      'x-user-id': userId,
      'x-user-role': 'customer',
      if (fullName != null && fullName.isNotEmpty) 'x-user-name': fullName,
    };

    try {
      final result = await _apiClient.get('/api/profile', headers: headers);
      if (result is Map<String, dynamic>) {
        return result;
      }
      return <String, dynamic>{};
    } on ApiException catch (e) {
      throw StateError(e.message);
    } on FormatException {
      throw const FormatException('Invalid JSON response from server.');
    } catch (e) {
      throw StateError('Failed to fetch profile via backend API: $e');
    }
  }

  Future<void> logout() async {
    final client = SupabaseService.client;
    final token = client.auth.currentSession?.accessToken;
    final userId = client.auth.currentUser?.id;

    if (token == null || token.isEmpty || userId == null) {
      await client.auth.signOut();
      return;
    }

    try {
      await _apiClient.post(
        '/api/auth/logout',
        headers: <String, String>{
          'x-user-id': userId,
          'x-user-role': 'customer',
        },
      );
    } catch (e) {
      // Log error but proceed to sign out locally
      print('Backend logout failed: $e');
    } finally {
      await client.auth.signOut();
    }
  }
}
