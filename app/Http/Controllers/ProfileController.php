<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Profile');
    }

    public function update(Request $request)
    {

        // dd('je;;p');
        try {
            $user = $request->user();

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'phone' => ['nullable', 'string', 'max:20'],
                'address' => ['nullable', 'string', 'max:255'],
                'bio' => ['nullable', 'string', 'max:1000'],
                'avatar' => ['nullable', 'image', 'max:2048'], // 2MB Max
                'current_password' => [
                    Rule::requiredIf($request->filled('password')),
                    function ($attribute, $value, $fail) use ($user) {
                        if ($value && !Hash::check($value, $user->password)) {
                            $fail('The current password is incorrect.');
                        }
                    },
                ],
                'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            ], [
                'name.required' => 'Name field is required',
                'email.required' => 'Email field is required',
                'email.email' => 'Please enter a valid email address',
                'email.unique' => 'This email is already taken',
                'phone.max' => 'Phone number cannot exceed 20 characters',
                'avatar.image' => 'File must be an image',
                'avatar.max' => 'Image size cannot exceed 2MB',
                'current_password.required' => 'Current password is required to change password',
                'password.min' => 'New password must be at least 8 characters',
                'password.confirmed' => 'Password confirmation does not match',
            ]);

            // Update basic information
            $user->fill([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'bio' => $validated['bio'],
            ]);

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                // Delete old avatar if exists
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }

                // Store new avatar
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $user->avatar = $avatarPath;
            }

            // Update password if provided
            if ($request->filled('password')) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            return back()->with('status', 'Profile updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred while updating profile. ' . $e->getMessage()]);
        }
    }

    public function deleteAvatar(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = null;
            $user->save();

            return back()->with('status', 'Profile picture removed successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred while removing profile picture.']);
        }
    }
}
